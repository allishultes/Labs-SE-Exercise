const franc = require('franc');
const languages = {'english' : 'eng', 'farsi': 'fas'}
const indexList = [];

const stripScript = (script) => {
    const strippedScript = [];
    script.forEach((line) => {
        if (line !== '') {
            strippedScript.push(line);
        } 
    })
    return strippedScript;
}

const removeIndex = (finalScript) => {
    const { script } = finalScript;
    script.forEach((section) => {
        delete section.index;
        const { shots } = section;
        shots.forEach((shot) => {
            delete shot.index;
        })
    })
    return finalScript;
}

const findShot = (currentSection, i) => {
    const { shots } = currentSection;
    const indexPos = shots.findIndex((object) => {
        return shots[(object.index > i) - 1];
    });
    
    if (indexPos > 0) {
        return shots[indexPos-1]
    }
    else return shots[shots.length -1];
}

const findSection = (finalScript, i) => {
    const { script } = finalScript;
    const indexPos = script.findIndex((object) => {
        return script[(object.index > i) - 1];
    });

    if (indexPos > 0) {
        return script[indexPos - 1]
    }
    else return script[script.length - 1];
}

const addVisuals = (firstEdit, shotScript) => {
    firstEdit.forEach(async (line, i) => {
        const currentSection = findSection(shotScript, i);
        const currentShot = findShot(currentSection, i);
        if (typeof line === 'string' && line.startsWith('PIX')) {
           currentShot.meta.pix = line;
           indexList.push(i);
        } else if (typeof line === 'string' && line.startsWith('GFX')) {
            currentShot.meta.graphics = line;
            indexList.push(i);
        }
    });
    return shotScript
}

const detectLanguage = async (line) => {
    try {
    const detectedLangs = franc.all(line);
    const finalLang = detectedLangs.find((language) => {
        if (language[0] === languages.english || language[0] === languages.farsi) {
            return language[0];
        } else {
            return null;
        }
    })
    return finalLang[0];
}
    catch(e) {
        return null;
    }
}

const addTranslations = async (script, finalScript) => {
    script.forEach(async (line, i) => {
        if (typeof line == 'string') {
            if (!(indexList.includes(i))) {
                const language = await detectLanguage(line);
                const currentSection = findSection(finalScript, i);
                const currentShot = findShot(currentSection, i);
                if (language === 'eng') {
                    currentShot.english.push(line);
                } else if (language === 'fas') {
                    currentShot.farsi.push(line);
                } else {
                    currentShot.text.push(line);
                }
            }
        }
    })
    return finalScript;
};


const addShots = (script, finalScript) => {
    script.forEach((line, i) => {
        if (typeof line === 'string' ) {
            if (line.startsWith('PTC') || line.startsWith('OOV') || line.startsWith('SOT')) {
                const section = findSection(finalScript, i);
                section.shots.push({
                    index: i,
                    meta: {
                        shot: line.replace(':', ''),
                    },
                    farsi: [],
                    english: [],
                    text: []
                });
                indexList.push(i);
            }

        }
    });
    return finalScript;
};

const addSections = (script, finalScript) => {
    script.forEach((line, i) => {
        if (line.section) {
            finalScript.script.push({
                index: i,
                section: line.section,
                shots: []
            })
        indexList.push(i);
        }
    })
    return finalScript
}

const reversionScript = async (script) => {
    const finalScript = { script: [] };
    const firstEdit = stripScript(script);
    const sectionScript = addSections(firstEdit, finalScript);
    const shotScript = addShots(firstEdit, sectionScript);
    const visualScript = addVisuals(firstEdit, shotScript);
    const translatedScript = await addTranslations(firstEdit, visualScript);

    const finishedScript = removeIndex(translatedScript);

    return finishedScript;
};

module.exports = {
    reversionScript,
    stripScript,
    removeIndex,
    findShot,
    addShots
}