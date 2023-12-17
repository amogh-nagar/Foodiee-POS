import React from 'react'
import PageNameWithDate from '../components/PageNameWithDate'
import {NavLink, useRouteMatch, Switch, Route} from 'react-router-dom'
import Roles from '../components/Roles/Roles';
import User from '../components/Users/Users';
const Users = () => {
  let { url } = useRouteMatch();
  return (
    <div>
        <PageNameWithDate name="Users" />
        <div className="w-full mb-4 px-4 mt-4">
        <ul className="flex h-10 w-full py-2 px-5 bg-primary-700 rounded-2xl">
          <li className="w-[67px] h-9 mr-4">
            <NavLink exact to={`${url}`} className="text-gray-300" activeClassName="active-dish-btn">
              Users
            </NavLink>
          </li>
          <li className="w-[95px] h-9 mr-4">
            <NavLink to={`${url}/roles`} className="text-gray-300" activeClassName="active-dish-btn">
              Roles
            </NavLink>
          </li>
        </ul>
        <Switch>
            <Route path={url} exact>
                <User/>
            </Route>
            <Route path={`${url}/roles`} >
                <Roles/>
            </Route>
        </Switch>
      </div>
    </div>
  )
}

export default Users