"use client";

import { useState } from "react";
import{
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
} from "@vis.gl/react-google-maps";
// @ts-ignore
import React from "react";

export default function Intro(){
    const position = {lat: 54.35126275796481, lng: 18.654804568859817};
    const [open, setOpen] = useState(false);

    return(
        <APIProvider apiKey={"AIzaSyDnKkSP0VlZoUMdIitJ8A3rwuJWQjlIXA4"}>
            <div style={{height: "100vh", width:"100%"}}>
                <Map zoom={15} center={position} mapId={"a2c09c5660267b55"}
                >
                    <AdvancedMarker position={position} onClick={() => setOpen(true)}>
                        <Pin
                            background={"red"}
                            borderColor={"grey"}
                            glyphColor={"white"} />
                    </AdvancedMarker>

                    {open &&(
                        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
                        <p>Biedronka</p>
                    </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    );
}
