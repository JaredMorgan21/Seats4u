//import logo from './logo.svg';
//import './App.css';
import {createVenue} from './Controller.js'
function App() {
  return (
    <div className = "App">
        name: <input id = "venueName"/><p></p>
        password: <input id = "venuePassword"/><p></p>

        <table>
            <tr>
                <th>Section</th>
                <th>Rows</th>
                <th>Columns</th>
            </tr>
            <tr>
                <th>Left</th>
                <td><input id="leftRows"/></td>
                <td><input id="leftColumns"/></td>
            </tr>
            <tr>
                <th>Center</th>
                <td><input id="centerRows"/></td>
                <td><input id="centerColumns"/></td>
            </tr>
            <tr>
                <th>Right</th>
                <td><input id="rightRows"/></td>
                <td><input id="rightColumns"/></td>
            </tr>
        </table>
        <p></p>
        <button onClick = {(e) => createVenue()}>Create Venue</button><p></p>
        result: <input id="result" readOnly/>

        <p></p>
        <button onClick = {(e) => document.location.href = 'shows.js'}>Create Show</button>
    </div>
  );
}

export default App;
