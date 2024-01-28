import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { Link } from 'react-router-dom'

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
    const positionLidl = {lat: 54.347633022458794, lng: 18.670118700796294};
    const positionCarrefour = {lat: 54.34758271621173, lng: 18.65842174947762};
    const [open, setOpen] = useState(false);
    const [openLidl, setOpenLidl] = useState(false);
    const [openCarrefour, setOpenCarrefour] = useState(false);
    const [heartClickedBiedronka, setHeartClickedBiedronka] = useState(false);
    const [heartClickedLidl, setHeartClickedLidl] = useState(false);
    const [heartClickedCarrefour, setHeartClickedCarrefour] = useState(false);


    return(
        <APIProvider apiKey={"AIzaSyDnKkSP0VlZoUMdIitJ8A3rwuJWQjlIXA4"}>
            <div style={{height: "100vh", width:"100%"}}>
                <Map zoom={15} center={position} mapId={"a2c09c5660267b55"}>
                    <AdvancedMarker position={position} onClick={() => setOpen(true)}>
                        <Pin background={"darkred"} borderColor={"grey"} glyphColor={"white"} />
                    </AdvancedMarker>
                    <AdvancedMarker position={positionLidl} onClick={() => setOpenLidl(true)}>
                        <Pin background={"darkred"} borderColor={"grey"} glyphColor={"white"} />
                    </AdvancedMarker>
                    <AdvancedMarker position={positionCarrefour} onClick={() => setOpenCarrefour(true)}>
                        <Pin background={"darkred"} borderColor={"grey"} glyphColor={"white"} />
                    </AdvancedMarker>


                    {open &&(
                        <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MdOutlineShoppingCart style={{ fontSize: '20px' }} />
                            <p style={{ fontSize: '20px', marginRight: '10px', fontWeight: 'bold' }}>Biedronka</p>
                            <FaHeart style={{ fontSize: "20px", marginRight: "10px",
                            color: heartClickedBiedronka ? "#bb2551" : "#414141",
                            WebkitTextStrokeWidth: heartClickedBiedronka ? "1px" : "0",
                            WebkitTextStrokeColor: heartClickedBiedronka ? "#bb2551" : "none",
                        }}onClick={() => setHeartClickedBiedronka(!heartClickedBiedronka)}
                        />
                        </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p>Szeroka 89, 80-835 Gdańsk</p>
                                <button type='button' style={{ backgroundColor: '#CCCCCC', borderRadius: '8px', padding: '8px 16px', marginTop: '8px' }}>
                                    <Link to={`../shop-map/1`}>
                                        Przejdź do sklepu
                                    </Link>
                                </button>
                            </div>
                    </InfoWindow>
                    )}
                    {openLidl &&(
                        <InfoWindow position={positionLidl} onCloseClick={() => setOpenLidl(false)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MdOutlineShoppingCart style={{ fontSize: '20px' }} />
                            <p style={{ fontSize: '20px', marginRight: '10px', fontWeight: 'bold' }}>Lidl</p>
                            <FaHeart style={{ fontSize: "20px", marginRight: "10px",
                            color: heartClickedLidl ? "#bb2551" : "#414141",
                            WebkitTextStrokeWidth: heartClickedLidl ? "1px" : "0",
                            WebkitTextStrokeColor: heartClickedLidl ? "#bb2551" : "none",
                        }}onClick={() => setHeartClickedLidl(!heartClickedLidl)}
                        />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p>Zawodników 4, 80-729 Gdańsk</p>
                                <button style={{ backgroundColor: '#CCCCCC', borderRadius: '8px', padding: '8px 16px', marginTop: '8px' }}>
                                    <Link to={`../shop-map/1`}>
                                        Przejdź do sklepu
                                    </Link>
                                </button>
                            </div>
                    </InfoWindow>
                    )}
                    {openCarrefour &&(
                        <InfoWindow position={positionCarrefour} onCloseClick={() => setOpenCarrefour(false)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <MdOutlineShoppingCart style={{ fontSize: '20px' }} />
                            <p style={{ fontSize: '20px', marginRight: '10px', fontWeight: 'bold' }}>Carrefour Express</p>
                            <FaHeart style={{ fontSize: "20px", marginRight: "10px",
                            color: heartClickedCarrefour ? "#bb2551" : "#414141",
                            WebkitTextStrokeWidth: heartClickedCarrefour ? "1px" : "0",
                            WebkitTextStrokeColor: heartClickedCarrefour ? "#bb2551" : "none",
                        }}onClick={() => setHeartClickedCarrefour(!heartClickedCarrefour)}
                        />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <p>Stągiewna 12/LOK. 11, 80-750 Gdańsk</p>
                                <button style={{ backgroundColor: '#CCCCCC', borderRadius: '8px', padding: '8px 16px', marginTop: '8px' }}>
                                    <Link to={`../shop-map/1`}>
                                        Przejdź do sklepu
                                    </Link>
                                </button>
                            </div>
                    </InfoWindow>
                    )}
                    {/* <div style={{
                         position: "absolute",
                         bottom: "20px",
                         left: "50%",
                         transform: "translateX(-50%)",
                         backgroundColor: "#CCCCCC",
                         borderRadius: "50%",
                         width: "100px", 
                         height: "100px",
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         boxShadow: "0 0 25px rgba(0, 0, 0, 0.5)"
                         }}>
                            <FaHeart
                            style={{fontSize: "60px", color: "red"}}
                            />
          </div> */}
                </Map>
            </div>
        </APIProvider>
    );
}
