// AI Moderation module - analyzes text for spam, offensive content, harassment
// Uses rule-based analysis (no external API needed)

const SPAM_KEYWORDS = [
    'buy now', 'click here', 'free money', 'earn money', 'make money fast',
    'limited offer', 'act now', 'congratulations you won', 'claim your prize',
    'no cost', 'risk free', 'guaranteed', 'double your', 'million dollars',
    'bitcoin', 'crypto invest', 'forex', 'mlm', 'pyramid',
    'whatsapp me', 'telegram', 'dm me', 'call now', 'text me at',
];

const OFFENSIVE_KEYWORDS = [
    'idiot', 'stupid', 'dumb', 'loser', 'hate you', 'shut up',
    'worst teacher', 'terrible professor', 'useless faculty',
];

const HARASSMENT_PATTERNS = [
    'kill', 'threat', 'hurt', 'attack', 'destroy', 'bomb',
    'stalk', 'track down', 'find where you live',
];

const IRRELEVANT_PATTERNS = [
    'subscribe to', 'follow me on', 'like and share', 'check out my',
    'selling', 'for sale', 'discount code',
];

function calculateWordOverlap(text, keywords) {
    const lowerText = text.toLowerCase();
    let matches = 0;
    for (const keyword of keywords) {
        if (lowerText.includes(keyword.toLowerCase())) {
            matches++;
        }
    }
    return matches;
}

function analyzeTextLength(text) {
    // Very short or very long texts can be suspicious
    const len = text.trim().length;
    if (len < 5) return 0.3;
    if (len > 3000) return 0.2;
    return 0;
}

function analyzeRepetition(text) {
    const words = text.toLowerCase().split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 5) {
        const ratio = uniqueWords.size / words.length;
        if (ratio < 0.3) return 0.4; // Very repetitive
        if (ratio < 0.5) return 0.2;
    }
    return 0;
}

function analyzeCapitalization(text) {
    const upperCount = (text.match(/[A-Z]/g) || []).length;
    const letterCount = (text.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 10) {
        const ratio = upperCount / letterCount;
        if (ratio > 0.7) return 0.3; // Excessive caps
    }
    return 0;
}

function analyzeSpecialChars(text) {
    const specialCount = (text.match(/[!@#$%^&*()]{2,}/g) || []).length;
    if (specialCount > 3) return 0.2;
    return 0;
}

export function analyzeContent(text) {
    if (!text || typeof text !== 'string') {
        return {
            spamScore: 0,
            isSpam: false,
            isOffensive: false,
            isHarassment: false,
            isIrrelevant: false,
            suggestedAction: 'approve',
            reasoning: 'No content to analyze',
        };
    }

    let spamScore = 0;
    const reasons = [];

    // Check spam keywords
    const spamMatches = calculateWordOverlap(text, SPAM_KEYWORDS);
    if (spamMatches > 0) {
        spamScore += Math.min(spamMatches * 0.15, 0.5);
        reasons.push(`Contains ${spamMatches} spam-related keyword(s)`);
    }

    // Check offensive keywords
    const offensiveMatches = calculateWordOverlap(text, OFFENSIVE_KEYWORDS);
    const isOffensive = offensiveMatches > 0;
    if (isOffensive) {
        spamScore += Math.min(offensiveMatches * 0.1, 0.3);
        reasons.push(`Contains ${offensiveMatches} potentially offensive term(s)`);
    }

    // Check harassment patterns
    const harassmentMatches = calculateWordOverlap(text, HARASSMENT_PATTERNS);
    const isHarassment = harassmentMatches > 0;
    if (isHarassment) {
        spamScore += Math.min(harassmentMatches * 0.2, 0.5);
        reasons.push(`Contains ${harassmentMatches} concerning pattern(s)`);
    }

    // Check irrelevant patterns
    const irrelevantMatches = calculateWordOverlap(text, IRRELEVANT_PATTERNS);
    const isIrrelevant = irrelevantMatches > 0;
    if (isIrrelevant) {
        spamScore += Math.min(irrelevantMatches * 0.1, 0.3);
        reasons.push(`Contains ${irrelevantMatches} off-topic pattern(s)`);
    }

    // Heuristic checks
    const lengthScore = analyzeTextLength(text);
    if (lengthScore > 0) {
        spamScore += lengthScore;
        reasons.push('Unusual text length');
    }

    const repetitionScore = analyzeRepetition(text);
    if (repetitionScore > 0) {
        spamScore += repetitionScore;
        reasons.push('High word repetition');
    }

    const capsScore = analyzeCapitalization(text);
    if (capsScore > 0) {
        spamScore += capsScore;
        reasons.push('Excessive capitalization');
    }

    const specialScore = analyzeSpecialChars(text);
    if (specialScore > 0) {
        spamScore += specialScore;
        reasons.push('Excessive special characters');
    }

    // Normalize score to 0-1
    spamScore = Math.min(spamScore, 1);
    spamScore = Math.round(spamScore * 100) / 100;

    // Determine suggested action
    let suggestedAction = 'approve';
    if (spamScore >= 0.7 || isHarassment) {
        suggestedAction = 'block_user';
    } else if (spamScore >= 0.4 || isOffensive) {
        suggestedAction = 'review';
    }

    const isSpam = spamScore >= 0.5;

    return {
        spamScore,
        isSpam,
        isOffensive,
        isHarassment,
        isIrrelevant,
        suggestedAction,
        reasoning: reasons.length > 0 ? reasons.join('. ') : 'Content appears clean',
    };
}
