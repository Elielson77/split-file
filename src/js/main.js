const inputFile = document.getElementById("file-input");
const chunkSizeInput = document.getElementById("chunk-size-input");
const imageOutput = document.getElementById("image-output");

inputFile.addEventListener("change", handleChangeInputFile);
chunkSizeInput.addEventListener("change", handleChangeChunkSize);

async function handleChangeInputFile(event) {
  const file = event.target.files[0];

  const arrayFile = await splitFile(file, chunkSizeInput.value);

  console.log(arrayFile);

  const mergedFile = mergeFile(arrayFile);

  imageOutput.src = URL.createObjectURL(mergedFile);

  console.log(mergedFile);
}

function splitFile(file, chunkSize) {
  console.log(file);
  const promise = new Promise((resolve, reject) => {
    try {
      const totalChunks = Math.ceil(file.size / chunkSize, chunkSize);
      const newFile = {
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
        totalChunks,
        chunks: [],
      };

      for (let i = 0; i < totalChunks; i++) {
        const offset = i * chunkSize;
        console.log(`${i + 1} / ${totalChunks}`);
        newFile.chunks.push(file.slice(offset, offset + chunkSize));
      }

      resolve(newFile);
    } catch (e) {
      reject(e);
    }
  });

  return promise;
}

function mergeFile(fileObj) {
  const { chunks, name, type, lastModified } = fileObj;

  return new File(chunks, name, { type, lastModified });
}

function handleChangeChunkSize(event) {
  const value = Number(event.target.value);

  if (!value || value < 1024) event.target.value = 1024;
}
