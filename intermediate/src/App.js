
// 1. Do a get request from this API and dump it on the screen
// 2a. Create a flat array with the location data only
// 2b. Create a table with the data in it (flatten location)
// row is a person, columms: street name, street number, city, state ...
// 3. Click on header and order the 
// 3a. sort it one way
// 3b toggle on click
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react'
import axios from 'axios';

const queryClient = new QueryClient()

function App() {
  const [people, SetPeople] = useState([])
  const [locations, SetLocations] = useState([])
  const [tableHeaders, SetTableHeaders] = useState([])

  async function fetchData() {
    try {
      const response = await axios.get(`https://randomuser.me/api?results=20`);
      const { results } = response.data;
      return results;
    } catch (error) {
      console.error(error);
    }
  }
  // https://www.tutorialspoint.com/flattening-a-json-object-in-javascript
  const flattenJSON = (obj = {}, res = {}, extraKey = '') => {
    for (const key in obj) {
      if (typeof obj[key] !== 'object') {
        res[extraKey + key] = obj[key];
      } else {
        flattenJSON(obj[key], res, `${extraKey}${key}.`);
      };
    };
    return res;
  };

  const flattenLocations = (locations) => {
    var flattenedLocations = [];

    for (const location of locations) {
      var flatLocation = {}
      flattenJSON(location, flatLocation);
      flattenedLocations.push(flatLocation)
    }
    SetTableHeaders(Object.keys(flattenedLocations[0]));

    // console.log(flattenedLocations);
    return flattenedLocations
  }

  const sortColumn = (header) => {
    const newFlattenedLocations = [
      ...locations
    ];
    // console.log(header)

    // console.log(newFlattenedLocations)
    newFlattenedLocations.sort((a, b) => {
      const valueA = a[header];
      const valueB = b[header];
      if (valueA < valueB) {
        return -1;
      }
      if (valueA > valueB) {
        return 1;
      }
      return 0;
    })
    // console.log(newFlattenedLocations)

    SetLocations(newFlattenedLocations);
  }

  useEffect(() => {
    fetchData().then(data => {
      SetPeople(data);
      SetLocations(flattenLocations(data.map(({ location }) => location)));
    })
  }, [])

  return (
    <>
      <h1>Locations</h1>
      <table>
        <thead>
          <tr>
            {tableHeaders.map((header, headerIdx) =>
              <th key={headerIdx} onClick={() => { sortColumn(header); }}>
                {`${header}`}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {locations.map((location, locationIdx) => (
            <>
              {
                <tr key={locationIdx}>
                  {Object.values(location).map((value, valueIdx) => (
                    <td key={valueIdx}> {value}</td>
                  ))
                  }
                </tr>
              }
            </>
          ))
          }
        </tbody >
      </table>
      <h2>Raw data</h2>

      {locations.map((location, idx) =>
        <>
          <pre>{JSON.stringify(location, null, 2)}</pre>
          <div key={idx}>{
            `${location.city} ${location["coordinates.latitude"]} ${location["street.name"]} `}
          </div>
        </>
      )}

      <h1>People</h1>
      {people.map((person, idx) => <div key={idx}>{
        `${person.name.first} ${person.name.last}`}
      </div>
      )}

      < QueryClientProvider client={queryClient} >
        <Example />
      </QueryClientProvider >
    </>
  )
}

function Example() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://randomuser.me/api?results=20').then((res) =>
        res.json(),
      ),
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  // console.log(data)
  return (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  )
  // return (
  //   <div>
  //     <h1>{data.name}</h1>
  //     <p>{data.description}</p>
  //     <strong>👀 {data.subscribers_count}</strong>{' '}
  //     <strong>✨ {data.stargazers_count}</strong>{' '}
  //     <strong>🍴 {data.forks_count}</strong>
  //   </div>
  // )
}

export default App;
