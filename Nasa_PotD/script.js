const key = "zsbAN6bQgZbB63ePAyo3Qg6L9b5Wiu3cgge5aXKR"

function processAPODData(response) {
    return {
        Title: response.title,
        Date: response.date,
        Explanation: response.explanation,
        url: response.url
    }
}

async function getAPOD() {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${key}`
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
    
        const json = await response.json()
        console.log(json)
        const processedData = processAPODData(json)
        console.log(processedData)
        updateDOM(processedData)
    }
    catch (error) {
        console.error(error.message)
    }
}

function updateDOM(data) {
    document.getElementById('title').textContent = data.Title
    document.getElementById('date').textContent = data.Date
    document.getElementById('explanation').textContent = data.Explanation
    document.getElementById('APOD').src = data.url
    document.getElementById('APOD-link').href = data.url
}

getAPOD()