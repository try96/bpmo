const container = document.getElementById('container')
const metronome = Object.assign(
    document.createElement('div'),
    {className: 'metronome'}
)
const now = Date.now() / 1000
const summary = Object.assign(
    document.createElement('div'),
    {className: 'summary'}
)
const colors = ['#c0392b', '#c0392b', '#e74c3c', '#e74c3c', '#e67e22', '#e67e22', '#ffb606', '#ffb606', '#62cb31', '#62cb31', '#3498db', '#3498db', '#9b59b6', '#9b59b6']
var iterator = 0
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
var clicks = [], differences = []

const circle = Object.assign(
    document.createElement('div'),
    {className: 'circle'}
)
document.body.appendChild(circle)

document.addEventListener('mousemove', () => {
    circle.style.left = `${event.clientX}px`
    circle.style.top = `${event.clientY}px`
    circle.animate([
        {opacity: 1}, {opacity: 0}
    ], {duration: 300})
})

document.addEventListener('mousedown', async function action() {
    mousedown = true
    while (mousedown) {
        circle.animate([
            {opacity: 1, transform: 'scale(1.5) translate(-50%, -50%)', background: 'rgba(255, 255, 255, .5)'}, {opacity: 0, transform: 'scale(1) translate(-50%, -50%)', background: 'none'}
        ], {duration: 200})
        await sleep(10)
    }
})

document.addEventListener('mouseup', () => {
    mousedown = false
})

async function pulseEffect(tileEnabled) {
    metronome.animate([
        {background: 'white', offset: 0}
    ], {duration: 300})
    if (tileEnabled) {
        const tile = Object.assign(
            document.createElement('div'),
            {className: 'tile'}
        )
        container.appendChild(tile)
        tile.animate([
            {opacity: 0, transform: `translateX(-50%) translateY(-600px)`, background: colors[Math.floor(Math.random() * colors.length)], offset: 1}
        ], {duration: 3000})
        await sleep(3000)
        container.removeChild(tile)
    }
}

function updateSummary(click, avg, first) {
    if (!(first)) {
        const interval = Object.assign(
            document.createElement('p'),
            {className: 'interval', innerHTML: `${differences[differences.length - 1] * 1000}ms (${((differences[differences.length - 1] - avg) * 1000).toFixed(0)}ms)`}
        )
        summary.appendChild(interval)
        interval.animate([
            {background: 'rgba(255, 255, 255, .1)', offset: 0}
        ], {duration: 200})
    }
    const clickContainer = Object.assign(
        document.createElement('div'),
        {className: 'click'}
    )
    clickContainer.innerHTML = `${clicks.length}. (${click.x}, ${click.y}) at ${(click.timestamp - now).toFixed(2)}s`
    summary.append(clickContainer)
    clickContainer.animate([
        {background: 'rgba(255, 255, 255, .1)', offset: 0}
    ], {duration: 200})
    summary.scrollTop = summary.scrollHeight
}

document.addEventListener('click', () => {
    if (event.target.className == 'summary') {
        return
    }
    document.body.appendChild(summary)
    const click = {
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now() / 1000
    }
    clicks.push(click)
    differences = clicks.map(x => {
        if (clicks.indexOf(x) != 0) {
            return Number((x.timestamp - clicks[clicks.indexOf(x) - 1].timestamp).toFixed(3))
        }
    }).filter(Boolean)
    const avg = (differences.reduce((x, a) => x + a, 0) / differences.length)
    const bpm = Number((60 / avg).toFixed(1))
    if (!(isNaN(bpm))) {
        updateSummary(click, avg, false)
        if (atFirst == true) {
            atFirst = false
            container.removeChild(hint)
            container.removeChild(loading)
            counter = document.createElement('h1')
            container.appendChild(counter)
            container.appendChild(metronome)
        }
        else {
            clearInterval(pulse)
        }
        pulseEffect(false)
        i = 1
        pulse = setInterval(() => {
            if (i >= 2) pulseEffect(true)
            else pulseEffect(false)
            i++
        }, avg * 1000)
        counter.innerHTML = `${bpm}<span>bpm</span>`
    }
    else {
        updateSummary(click, avg, true)
        loading = Object.assign(
            document.createElement('h2'),
            {className: 'loading'}
        )
        hint = Object.assign(
            document.createElement('p'),
            {className: 'hint', innerHTML: 'press one more time'}
        )
        for (char of '...') {
            loading.appendChild(Object.assign(
                document.createElement('span'),
                {innerHTML: char}
            ))
        }
        container.appendChild(loading)
        container.appendChild(hint)
        atFirst = true
        async function wave() {
            while (atFirst) {
                for (span of loading.children) {
                    if (atFirst) {
                        span.animate([
                            {opacity: 1, offset: 0.5}
                        ], {duration: 500})
                        await sleep(60)
                        span.style.opacity = 0.2
                    }
                }
                await sleep(1000)
            }
        }
        wave()
    }
})