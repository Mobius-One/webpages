document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('button');
    button.addEventListener('click', transformJson);
});

async function transformJson() {
    const url = "https://www.streamraiders.com/api/game/";

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const n_url = data.info.dataPath;

        await fetchMapNodes(n_url);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
    }
}

async function fetchMapNodes(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        parseJson(url, data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error.message);
    }
}

async function parseJson(url, response) {
    try {

        //Extract MapNodes from the json
        const mapNodes = response["sheets"]["MapNodes"]

        //Remove unwanted keys from each map node
        for (const nodeKey in mapNodes) {
            const node = mapNodes[nodeKey];
            if (
                node.ChestType === "dungeonchest" ||
                node.ChestType === "bonechest" ||
                node.ChestType === "chestbronze" ||
                node.ChestType === "chestsilver" ||
                node.ChestType === "chestgold"
            ) {
                delete mapNodes[nodeKey];
                continue;
            }
            for (const keyToRemove of ["NodeDifficulty", "NodeType", "MapTags", "OnLoseDialog", "OnStartDialog", "OnWinDialog"]) {
                delete node[keyToRemove];
            }
        }

        //Create the transformed JSON
        const transformedJson = {
            url: url,
            MapNodes: mapNodes
        };

        //Convert the JSON to a Blob
        const blob = new Blob([JSON.stringify(transformedJson, null, 2)], { type: 'application/json' });

        //Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'loyalty_chests.json';

        //Trigger the download
        downloadLink.click();
    } catch (error) {
        console.error(error.message);
    }
}