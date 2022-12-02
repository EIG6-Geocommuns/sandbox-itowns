import * as itowns from 'itowns';

interface Bounds {
    maxlat: number, maxlon: number,
    minlat: number, minlon: number
}

interface Element {
    bounds: Bounds,
    id: number,
    tags?: {
        area?: string,
        name?: string
    }
}

class MemorySource extends itowns.Source {
}

const orthoSource = new itowns.WMTSSource({
    url: 'http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    crs: 'EPSG:3857',
    name: 'ORTHOIMAGERY.ORTHOPHOTOS',
    tileMatrixSet: 'PM',
    format: 'image/jpeg',
});

const overpassURL = "https://lz4.overpass-api.de/api/interpreter";

function overpass(coordinates: itowns.Coordinates, timeout=10): Promise<any> {
    const coords = coordinates.as('EPSG:4326')

    const header = `[out:json][timeout:${timeout}];`;
    const query =
        `is_in(${coords.y},${coords.x})->.a;` +
        `way(pivot.a);` +
        `out tags bb;` +
        //`out ids geom(43.833,4.35533,43.83545,4.36335);` +
        `relation(pivot.a);` +
        `out tags bb;`


    return fetch(`${overpassURL}?`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: `${header}${query}`
    }).then((res) => res.json())
}

function main() {
    const viewerDiv = document.getElementById('viewerDiv') as HTMLDivElement;

    const coords = new itowns.Coordinates('EPSG:4326', 2.351323, 48.856712);
    const placement = { coord: coords, range: 4000, tilt: 0 /* 50 */ };

    const view = new itowns.GlobeView(viewerDiv, placement);
    view.addLayer(new itowns.ColorLayer('ortho', {
        source: orthoSource
    }));

    overpass(coords).then((json) => {
        //if (false) return;
        const elts: Array<Element> = json.elements;
        elts.forEach((elt) => {
            console.log(elt);

            console.log(`[${elt.id}] ${elt?.tags?.name}`)
        })
    });
}

function clas() {

}

export default {
    main,
    clas
}
