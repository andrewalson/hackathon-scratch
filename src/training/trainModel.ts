import * as tf from '@tensorflow/tfjs';

// Define categories and their corresponding labels
const categories = ["Search Engine", "Consumer Electronics", "Software", "E-commerce"];
const categoryLabels = {
  "google.com": 0,
  "apple.com": 1,
  "microsoft.com": 2,
  "mozilla.org": 2,
  "amazon.com": 3,
  "alibaba.com": 3
};

// Sample training data (replace with actual data)
const texts = [
  'Google is a search engine that provides various web services.',
  'Apple designs and manufactures consumer electronics, software, and digital services.',
  'Microsoft is a software company that provides enterprise solutions and operating systems.',
  'Mozilla develops the Firefox web browser and other open-source software.',
  'Amazon is an e-commerce platform offering a wide range of products and cloud services.',
  'Alibaba is a global e-commerce platform with a focus on B2B and retail services.'
];
const labels = [
  categoryLabels["google.com"],
  categoryLabels["apple.com"],
  categoryLabels["microsoft.com"],
  categoryLabels["mozilla.org"],
  categoryLabels["amazon.com"],
  categoryLabels["alibaba.com"]
];

// Tokenize the text (simple split by space, replace with more sophisticated tokenizer if needed)
function tokenize(text: string): number[] {
  return text.split(' ').map((word) => word.length);
}

// Convert texts to tensors
const maxTextLength = Math.max(...texts.map(text => text.split(' ').length));
const inputTensors = tf.tensor2d(texts.map(tokenize), [texts.length, maxTextLength]);
const labelTensors = tf.tensor1d(labels, 'int32');

// Define the model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [maxTextLength], units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: categories.length, activation: 'softmax' }));

// Compile the model
model.compile({
  optimizer: tf.train.adam(),
  loss: 'sparseCategoricalCrossentropy',
  metrics: ['accuracy'],
});

// Train the model
async function trainModel() {
  await model.fit(inputTensors, labelTensors, {
    epochs: 50,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}, accuracy = ${logs?.acc}`);
      },
    },
  });

  // Save the model
  await model.save('localstorage://tech-category-model');
  console.log('Model training complete and saved.');
}

trainModel();
