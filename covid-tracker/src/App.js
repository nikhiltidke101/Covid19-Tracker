import './App.css';
import {FormControl,Select,MenuItem} from '@material-ui/core';
import React , {useState, useEffect} from "react";
import {Card, CardContent, Typography} from '@material-ui/core';
import axios from 'axios';
import Infobox from './components/Infobox';
import Map from './components/Map';
import Table from './components/Table.js';
import LineGraph from './components/LineGraph'
import {sortData} from './util.js';
import "leaflet/dist/leaflet.css"; 

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo]= useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter]= useState({lat:34.80764,lng:-40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    })
  },[])

  useEffect(()=>{
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response=> response.json())
      .then((data)=> {
        const countries = data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2,

        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);  
      });
    };
    getCountriesData();

  },[country]);

  const onCountryChange = async(event)=>{
    const countryCode = event.target.value;
    const url = countryCode  == "Worldwide" ? "https://disease.sh/v3/covid-19/all": `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
      console.log([data.countryInfo.lat, data.countryInfo.long])
      if (countryCode === "Worldwide"){
        setMapCenter(...mapCenter)
      }else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      }
      setMapZoom(4);
    });
  };
  console.log(countryInfo);




  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>
            Covid Tracker 
          </h1>
          <FormControl className="app__dropdown">
            <Select 
            variant="outlined" 
            onChange={onCountryChange}
            value={country}>

                <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country)=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}

            </Select>
          </FormControl>
        </div>
    
        <div className="app__stats">
              <Infobox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
              <Infobox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
              <Infobox title="Death Cases" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>

        <Map countries={mapCountries}center={mapCenter} zoom={mapZoom}/>
        </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live cases</h3>
          <Table countries ={tableData}/>

          <LineGraph/>
        </CardContent>
              
      </Card>
      
    </div>
  );
}

export default App;
