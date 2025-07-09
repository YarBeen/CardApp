import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Search from "./components/Search.jsx";
import {useDebounce} from 'react-use';
const CardComponent = ({ title, description , img}) => {

  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(0);

    useEffect(() => {
    console.log(`${title}  has been liked:   ${hasLiked}`);
  }, [hasLiked]);
  return (
    <div
      className="card"
      onClick={() => setCount((prevState) => prevState + 1)}
    >
      <h1>{title}</h1>
      <p className="text-white">{description}</p>
        <img  src={img} alt={title} />
      <p>{count}</p>

      <button
        onClick={() => {
          setHasLiked(!hasLiked);
        }}
      >
        {hasLiked ? "Liked" : "Like"}
      </button>
    </div>
  );
};
const TextComponent = ({ text }) => {
  return (
    <div>
      <h1>Ola</h1>
      <p>This is a simple React component. {text}</p>
    </div>
  );
};

const PKTC_API_BASE_URL = "https://api.pokemontcg.io/v2";
const PKTC_API_CARDS_ENDPOINT = "/cards";
const PKTC_API_KEY = import.meta.env.VITE_PKTCG_API_KEY;
const PKTCG_API_OPTIONS= {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${PKTC_API_KEY}`,
  },
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cardList, setCardList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchedTerm, setDebouncedSearchedTerm] = useState('');
    //Prevent too many api calls
    useDebounce(()=> setDebouncedSearchedTerm(searchTerm), 500, [searchTerm]);
    //No deps, only run when componenet loads.
    useEffect(() => {

    },[]);
    useEffect(() => {
        if (searchTerm.trim() !== "") {
            fecthCards();
        } else {
            setCardList([]); // limpiar resultados si el término está vacío
        }
    },[debouncedSearchedTerm]);

    const fecthCards = async () => {
        setIsLoading(true);
        try {
            const endpoint = `${PKTC_API_BASE_URL}${PKTC_API_CARDS_ENDPOINT}?q=name:*${searchTerm}*`;
            const response = await fetch(endpoint, PKTCG_API_OPTIONS);
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || "Error en la solicitud");
            }

            if(data.Response === 'False'){
                setCardList([]);
                throw new Error("No se encontraron resultados");

            }
            setCardList(data.data);
            console.log(data);

        }
        catch (error) {
            setCardList([]);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
            <h1>Mira las <span className="text-gradient ">Cartas aja papis</span> de la API </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
          {isLoading ? (
              <p>Cargando...</p>
          ) : (
              <div className="cards">
                  <ul>
                      {cardList.map((card) => (
                          <CardComponent key={card.id} title={card.name} description={card.flavorText || "No habia descripcion papiis"} img={card.images.small} />
                      ))}
                  </ul>
              </div>
          )}
      </div>
    </main>
  );
};

export default App;
