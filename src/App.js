//import logo from './logo.svg';
//import './App.css';
import {createVenue} from './Controller.js'
import {deleteVenue} from './Controller.js'

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
        <button onClick = {(e) => createVenue(document.getElementById("venueName").value,
                                                document.getElementById("venuePassword").value,
                                                document.getElementById("leftRows").value,
                                                document.getElementById("leftColumns").value,
                                                document.getElementById("centerRows").value,
                                                document.getElementById("centerColumns").value,
                                                document.getElementById("rightRows").value,
                                                document.getElementById("rightColumns").value)}>Create Venue</button><p></p>
        <p id="result" readOnly/>

        <p></p>
        <button onClick = {(e) => document.location.href = 'shows.js'}>Create Show</button><p></p>

        venue name: <input id = "venueNameDelete"/><p></p>
        admin password: <input id = "adminPassword"/><p></p>
        <button onClick = {(e) => deleteVenue(document.getElementById("venueNameDelete").value, document.getElementById("adminPassword").value)}>Delete venue</button>
        <p id="venueDeleteResult"/>
    </div>
  );
}

export default App;
