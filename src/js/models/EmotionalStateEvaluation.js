import { RatedWordsReference } from "./RatedWordsReference";
import { EmotionalState, WordType } from "./EmotionalState";
import * as wordsProvider from './RatedWordsProvider.js';

/**
 * Factory for creating EmotionalStateEvaluation object
 */
export class EmotionalStateEvaluationFactory {
    /**
     * Creates asynchronously EmotionalStateEvaluation object.
     */
    async createEvaluation() {
        const e = new EmotionalStateEvaluation();
        e.state = new EmotionalState();
        e.ratedWordsRef = await this._buildEmoReference();
        return e;
    }

    async _buildEmoReference() {
        const _stopwords = wordsProvider.getStopWords();
        const _vulgarwords = wordsProvider.getVulgarWords();
        const _nawlWords = wordsProvider.getNAWLWords();
        const _rosenbergWords = wordsProvider.getRosenbergWords();
        const [stopwords,vulgarwords,nawlWords,rosenbergWords] = await Promise.all([_stopwords, _vulgarwords, _nawlWords, _rosenbergWords]);
        return new RatedWordsReference(stopwords, vulgarwords, nawlWords, rosenbergWords);
    }
}

/**
 * Describes the process of assessment of someone's EmotionalState
 * based on words he or she provides to the system.
 */
export class EmotionalStateEvaluation {
    /**
    * @typedef {import('./EmotionalState.js').HSV} HSV
    */
     /**
     * Get emotional state presented as color encoded in HSV model.
     * @returns {HSV} Color as HSV (Hue, Saturation, Value)
     */
    get EmotionalStateHSV() {
        return this.state.getEmotionStateAsHSVColor();
    }

    /**
     * Get list of Polish emotionally charged words as defined by Marschall Rosenberg.
     * @returns {Array} Array of RatedWordEntry objects of WordType.ROSENBERG. 
     */
    get RosenbergWords() {
        return this.ratedWordsRef.entries.filter(emoStem => 
                                                 emoStem.wordType === WordType.ROSENBERG); 
    }

    /**
     * Add user's word to the Emotional State.
     * @param {string} word from the user 
     * @returns {void}
     */
    addWord(word) {
        const emotionalCharge = this.ratedWordsRef.getEmotionalCharge(word);
        this.state.addEmotionalCharge(emotionalCharge);
    }

    /**
     * Clear state of the evaluation.
     * It is advides to clear state instead of creating new EmotionalStateEvaluation object,
     * because the creation process requires web traffic to download dictionaries. 
     * @returns {void}
     */
    restartEvaluation() {
        this.state = new EmotionalState();
    }
}

export default EmotionalStateEvaluation;