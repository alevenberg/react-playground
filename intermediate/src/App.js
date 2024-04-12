
// 1. Do a get request from this API and dump it on the screen
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <h1>Hi</h1>
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
