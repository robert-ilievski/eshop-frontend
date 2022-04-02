import { useLocation } from "react-router";


export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const transformDate = (dateString) =>{
    const date = new Date(dateString);

    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
}

export const sortElementsByDateCreated = (array) => {
    return array.slice().sort((a, b) => {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    });
}
