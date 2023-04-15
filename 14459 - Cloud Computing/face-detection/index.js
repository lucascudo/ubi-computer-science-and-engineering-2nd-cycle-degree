const Vision = require('@google-cloud/vision');

function main() {
    if (!process.argv[2]) {
        console.log('Missing image path. Usage: node index.js <IMAGE_URL>');
        return;
    }
    console.log('Faces:');
    detectFaces(process.argv[2]).then((faces) => faces.forEach((face, i) => {
        console.log(`  Face #${i + 1}:`);
        console.log(`    Joy: ${face.joyLikelihood}`);
        console.log(`    Anger: ${face.angerLikelihood}`);
        console.log(`    Sorrow: ${face.sorrowLikelihood}`);
        console.log(`    Surprise: ${face.surpriseLikelihood}`);
    }));
}

async function detectFaces(imgPath) {
    const client = new Vision.ImageAnnotatorClient();
    const [result] = await client.faceDetection(imgPath);
    return result.faceAnnotations;
}

main();
