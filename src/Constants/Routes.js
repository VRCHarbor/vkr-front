import React from "react";
import {useParams} from 'react-router-dom';
import { RoadMapView } from "../Components/RoadmapView";



function CategoryRoute(){

    let {id} = useParams();

    console.log(id);

    return(
    <RoadMapView categoryId={id}/>
    );
}


export {CategoryRoute};