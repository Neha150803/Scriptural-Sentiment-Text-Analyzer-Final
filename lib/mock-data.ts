export const mockAnalysisResult = {
  input_text:
    "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul. He leads me in paths of righteousness for his name's sake.",
  cleaned_text:
    "lord shepherd shall want makes lie green pastures leads beside still waters restores soul leads paths righteousness name sake",
  word_count: 37,
  char_count: 189,
  avg_word_length: 4.1,
  ml_prediction: {
    sentiment: "Positive",
    confidence: 0.92,
    probabilities: {
      Positive: 0.92,
      Negative: 0.03,
      Neutral: 0.05,
    },
  },
  vader_analysis: {
    sentiment: "Positive",
    scores: {
      compound: 0.7845,
      pos: 0.312,
      neu: 0.688,
      neg: 0.0,
    },
  },
  textblob_analysis: {
    sentiment: "Positive",
    polarity: 0.15,
    subjectivity: 0.35,
  },
}

export const mockFileAnalysisResult = {
  input_text:
    "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. For God did not send his Son into the world to condemn the world, but to save the world through him.",
  cleaned_text:
    "god loved world gave one son whoever believes shall perish eternal life god send son world condemn world save world",
  word_count: 47,
  char_count: 234,
  avg_word_length: 4.5,
  ml_prediction: {
    sentiment: "Positive",
    confidence: 0.89,
    probabilities: {
      Positive: 0.89,
      Negative: 0.04,
      Neutral: 0.07,
    },
  },
  vader_analysis: {
    sentiment: "Positive",
    scores: {
      compound: 0.8316,
      pos: 0.285,
      neu: 0.715,
      neg: 0.0,
    },
  },
  textblob_analysis: {
    sentiment: "Positive",
    polarity: 0.22,
    subjectivity: 0.28,
  },
}
