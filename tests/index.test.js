const { expect } = require('chai');
const reversion = require('../reversion')

describe('Reversioning script', () => {
    it('stripScript: should strip blank lines from the script', async () => {
        const testScript = [
            '',
            'This is a test line',
            '',
            '',
            'This is a test line'
        ];
        const testResult = [
            'This is a test line',
            'This is a test line'
        ]
        const result = reversion.stripScript(testScript);
        expect(result).to.deep.equal(testResult);
        expect(result).to.have.length(2);
    });

    // it('removeIndex: should delete index field from the script', () => {
    //     const testScript = {
    //         script: [
    //         {
    //             section: 'test section',
    //             shots: [
    //             {
    //                 meta: [],
    //                 index: 27,
    //                 english: [],
    //                 farsi: []
    //             },
    //             {
    //                 meta: [],
    //                 index: 29,
    //                 english: [],
    //                 farsi: []
    //             }
    //             ]
    //         }
    //     ]
    // };
    //     const result = reversion.removeIndex(testScript);
    //     expect(result.script[0]).to.not.have.deep.property('index');
    //     expect(result.script[1]).to.not.have.deep.property('index');
    // });

    // it('findShot: should return proper object', () => {
    //     const testScript = {
    //         script: [
    //             {
    //                 section: 'test section',
    //                 shots: [
    //                     {
    //                         meta: [],
    //                         index: 27,
    //                         english: [],
    //                         farsi: []
    //                     },
    //                     {
    //                         meta: [],
    //                         index: 29,
    //                         english: [],
    //                         farsi: []
    //                     }
    //                 ]
    //             }
    //         ]
    //     };
    //     const firstTestIndex = 28;
    //     const secondTestIndex = 32;
    //     const firstResult = reversion.findShot(testScript, firstTestIndex);
    //     expect(firstResult).to.deep.equal(testScript.script[0]);
    //     const secondResult = reversion.findShot(testScript, secondTestIndex);
    //     expect(secondResult).to.deep.equal(testScript.script[1]);
    // })
})