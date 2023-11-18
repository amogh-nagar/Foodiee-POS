import React from 'react'
import Header from './components/Header'
import { Route, Switch } from 'react-router-dom'
import { routesList } from './utils/routes'

const App = () => {
  return (
    <div className='flex'>
        <Header/>
        <div className='bg-primary-50 w-full h-screen text-text'>
        <Switch>
            {
                routesList.map((route, index) =>{
                    return (
                        <Route key={index} path={route.path} exact>
                            {route.component}
                        </Route>
                    )
                })
            }
        </Switch> 
        </div>
    </div>
  )
}

export default App