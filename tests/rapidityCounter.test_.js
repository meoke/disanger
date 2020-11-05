import t from 'tape'
import GameInput from '../src/js/gameInput.js'
import RapidityCounter from '../src/js/rapidityCounter.js'

t.test('first getScore request should return 0', function(t){
    let rc = new RapidityCounter()

    const expectedScore = 0
    const actualScore = rc.updateScore(new GameInput("", new Date('1995-12-17T03:24:00')))
    t.equal(actualScore, expectedScore)
    t.end()
})

t.test('time difference equal 0 should return 10000', function(t){
    let rc = new RapidityCounter()

    const expectedScore = 0
    rc.updateScore(new GameInput("", new Date('1995-12-17T03:24:00')))
    const actualScore = rc.updateScore(new GameInput("", new Date('1995-12-17T03:24:00')))
    t.equal(actualScore, expectedScore)
    t.end()
})

t.test('time difference smaller than 0 should return 0', function(t){
    let rc = new RapidityCounter()

    const expectedScore = 0
    rc.updateScore(new GameInput("", new Date('1995-12-17T03:24:00')))
    const actualScore = rc.updateScore(new GameInput("", new Date('1995-12-17T03:20:00')))
    t.equal(actualScore, expectedScore)
    t.end()
})

t.test('time differences of different lengths', function(t){
    let dates = [[new Date('1995-12-17T03:24:00'), new Date('1995-12-17T03:24:01'), 10],
                [new Date('1995-12-17T03:24:00'), new Date('1995-12-17T03:25:00'), 0],
                [new Date(200), new Date(700), 20]
                ]

    let rc = new RapidityCounter()
    for(let [first, second, expectedScore] of dates){
        rc.updateScore(new GameInput("", new Date(first)))
        const actualScore = rc.updateScore(new GameInput("", new Date(second)))
        t.equal(actualScore, expectedScore, `difference of ${(second-first)/1000}s`)      
    }
    t.end()
})

