# Node.js facial detection

## Usage


1 - [Set up your GCP project and authentication](https://cloud.google.com/vision/docs/detecting-faces?apix_params=%7B%22resource%22%3A%7B%22requests%22%3A%5B%7B%22features%22%3A%5B%7B%22maxResults%22%3A10%2C%22type%22%3A%22FACE_DETECTION%22%7D%5D%2C%22image%22%3A%7B%22source%22%3A%7B%22imageUri%22%3A%22gs%3A%2F%2Fcloud-samples-data%2Fvision%2Fface%2Ffaces.jpeg%22%7D%7D%7D%5D%7D%7D#set-up-your-gcp-project-and-authentication)

2 - Install dependencies
```sh
$ npm i
```

3 - Run application
```sh
$ node index.js <IMAGE_URL>
```
