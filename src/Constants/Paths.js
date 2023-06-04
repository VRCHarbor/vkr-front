const RoadMapAPIURL = "https://localhost:7050";


async function LoadCategories(){
    var responce = await fetch(API_Controls.CategoriesList);

    if(responce.ok)
    {
        var data = await responce.json();
        return data;
    }
}

const API_Controls = {
    CategoriesList: `${RoadMapAPIURL}/category`,
    Roadmap: `${RoadMapAPIURL}/roadmap`,
    RoadmapElement: `${RoadMapAPIURL}/element`,
    Image: `${RoadMapAPIURL}/image`
};

const GetElementFromAPI = {
    GetRoadMapsByCategory: (catId) => `${API_Controls.CategoriesList}/${catId}`,
    GetRoadMap: (RoadMapID) =>`${API_Controls.Roadmap}/${RoadMapID}`,
    GetRoadMapElement: (RoadMapElementID) =>`${API_Controls.RoadmapElement}/${RoadMapElementID}`,
    GetRoadMapCategory: (CategoryId) => `${API_Controls.CategoriesList}/${CategoryId}`,
};

const PostElementToAPI = {
    PostNewRoadmapCategory: (name) => `${API_Controls.CategoriesList}?newCatName=${name}`,
    PostNewRoadmap: (catId, name) => `${API_Controls.CategoriesList}/${catId}?roadMapName=${name}`,
    PostNewElement: (RoadmapId, Title) => `${API_Controls.Roadmap}/${RoadmapId}?title=${Title}`,
    PatchElementContent: (ElementId) => `${API_Controls.RoadmapElement}/${ElementId}`
}

export {API_Controls, GetElementFromAPI, PostElementToAPI, LoadCategories}