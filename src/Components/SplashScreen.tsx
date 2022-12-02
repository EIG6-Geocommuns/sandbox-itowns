import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import * as itowns from 'itowns';

import SearchBar from './SearchBar';

const initSelectView = (viewerDiv: HTMLDivElement): itowns.PlanarView => {
    const ignSource = new itowns.WMTSSource({
        url: 'https://wxs.ign.fr/cartes/geoportail/wmts',
        crs: 'EPSG:3857',
        name: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
        tileMatrixSet: 'PM',
        format: 'image/png'
    });

    const extent = new itowns.Extent(
        'EPSG:3857',
        -20037508.34, 20037508.34,
        -20048966.1, 20048966.1
    );

    const placement = new itowns.Extent(
        'EPSG:3857',
        -650631.984763, 1167957.792197, // west, east
        5067754.851372, 3449735.836632  // north, south
    );

    // Create the view
    let view = new itowns.PlanarView(viewerDiv, extent, {
        camera: { type: itowns.CAMERA_TYPE.ORTHOGRAPHIC },
        controls: {
            // We want to keep the rotation disabled, to only have a view from the top
            enableRotation: false,
            // We do not want the user to zoom out too much
            maxAltitude: 40000000,
            // Prevent from zooming in too much, here a pixel shall not
            // represent a metric size smaller than 5 mm
            maxResolution: 0.005
        },
        placement: placement,
    });

    const ignLayer = new itowns.ColorLayer('PLANIGN', {
        source: ignSource
    });
    view.addLayer(ignLayer);

    return view;
}

const SelectView = (props: {id: string}) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [view, setView] = useState<itowns.PlanarView>();

    useEffect(() => {
        const { current: viewerDiv } = viewerRef;
        if (viewerDiv && !view) {
            let view = initSelectView(viewerDiv);
            setView(initSelectView(viewerDiv));
        }
        return () => {
            view?.dispose()
        }
    }, []);

    return (
        <div id={props.id} ref={viewerRef}>
        </div>
    );
}

interface Location {
    fulltext: string,
    coords: itowns.Coordinates,
};

type LocationSelectProps = {
    onSelected: (loc: Location, extent: boolean) => void
}

const LocationSelect = (props: LocationSelectProps) => {
    const [checkedAll, setCheckedAll] = useState(false);

    function onSearchBarSelected(loc: Location) {
        props.onSelected(loc, checkedAll);
    }

    // TODO: Add onSearchBarSelected listener to SearchBar when it will be
    // implemented
    return (
        <div id="placeselection">
            <SearchBar />
            <div>
                <label htmlFor="select-all">Sélectionner le lieu en entier</label>
                <input type="checkbox"
                       id="select-all" name="select-all"
                       defaultChecked={checkedAll}
                       onChange={() => setCheckedAll(!checkedAll)} />
            </div>
        </div>
    )
}

type Tool = 'Point' | 'Polygon'

const ToolBar = (props: { onToolSelected:(t?: Tool) => void }) => {
    const [currentTool, setCurrentTool] = useState<Tool>()

    function setTool(tool?: Tool) {
        setCurrentTool(tool);
        props.onToolSelected(tool);
    }

    // TODO: SVG icons for buttons
    // TODO: Use currentTool state to 'hover' the current selected button
    return (
        <div id="select-toolbar">
            <button onClick={() => setTool('Point')}>Point</button>
            <button onClick={() => setTool('Polygon')}>Polygone</button>
            <button onClick={() => setTool()}>Reset</button>
        </div>
    )
}

// TODO: communication between itowns view and the sidebar
const SplashScreen = () => {
    function onToolSelected(t?: Tool) {}
    function onLocationSelected(l: Location, isExtent: boolean) {}

    return (
        <>
        <SelectView id="viewerDiv" />
        <div id="sideForm">
            <input type="text" placeholder="Nom du projet" required />
            <h2>Selectionner l'emprise</h2>
            <LocationSelect onSelected={onLocationSelected} />
            <ToolBar onToolSelected={onToolSelected} />
            <input type="submit" value="Extraire" />
        </div>
        </>
    )
}

export default SplashScreen;
