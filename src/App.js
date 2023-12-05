//import logo from './logo.svg';
//import './App.css';
import {createVenue, generateReportVM} from './Controller.js'
import {deleteVenue} from './Controller.js'
import {listVenues} from './Controller.js'
import {createShow} from './Controller.js'
import {searchShows} from './Controller.js'
import {deleteShow} from './Controller.js'
import {activateShow} from './Controller.js'
import {listShows} from './Controller.js'
import {deleteShowAdmin} from './Controller.js'
import {generateReportAdmin} from './Controller.js'
import {createBlock} from './Controller.js'
import {deleteBlock} from './Controller.js'
import {listBlocks} from './Controller.js'
import {purchaseSeats} from './Controller.js'
import {listActiveShows} from './Controller.js'
import {showAvailableSeats} from './Controller.js'

function App() {
  return (

    <div className = "App">

        name: <input id = "venueName"/><br/>
        password: <input id = "venuePassword"/><br/>

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
        </table><br/>
        <button onClick = {(e) => createVenue(document.getElementById("venueName").value,
                                                document.getElementById("venuePassword").value,
                                                document.getElementById("leftRows").value,
                                                document.getElementById("leftColumns").value,
                                                document.getElementById("centerRows").value,
                                                document.getElementById("centerColumns").value,
                                                document.getElementById("rightRows").value,
                                                document.getElementById("rightColumns").value)}>Create Venue</button><br/>
        <p id="result" readOnly/>

        venue name: <input id = "venueNameCreateShow"/><br/>
        venue password: <input id = "venuePasswordCreateShow"/><br/>
        show title: <input id = "showTitle"/><br/>
        start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTime"/><br/>
        end date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showEndTime"/><br/>
        uses blocks? 'Boolean 0 or 1': <input id = "usesBlocks"/><br/>
        optPrice (if not using blocks, enter universal seat price. DO NOT enter anything if using blocks): <input id = "optPrice"/><br/>

        <button onClick = {(e) => createShow(document.getElementById("venueNameCreateShow").value,
                                            document.getElementById("venuePasswordCreateShow").value,
                                            document.getElementById("showTitle").value,
                                            document.getElementById("showStartTime").value,
                                            document.getElementById("showEndTime").value,
                                            document.getElementById("usesBlocks").value,
                                            document.getElementById("optPrice").value
                                            )}>Create Show</button><br/>
        <p id="resultShow" readOnly/>

        venue name: <input id = "venueNameDelete"/><br/>
        venue password: <input id = "venuePasswordDelete"/><br/>
        <button onClick = {(e) => deleteVenue(document.getElementById("venueNameDelete").value, document.getElementById("venuePasswordDelete").value)}>Delete venue</button>
        <p id="venueDeleteResult"/>

        admin password: <input id = "adminPass"/><br/>
        <button onClick = {(e) => listVenues(document.getElementById("adminPass").value)}>List Venues</button>
        <p id="venuesList"/>

        {/* search shows for the consumer */}
        search: <input id = "searchShowInput"/><br/>
        <button onClick = {(e) => searchShows(document.getElementById("searchShowInput").value)}>Search!</button>
            {/* list active shows - same as search shows except give it an empty string*/}
            <button onClick = {(e) => listActiveShows()}>List Active Shows</button>
        <p id="searchShowsList"/>

        {/* delete show for venue manager */}
        venue name: <input id = "venueNameDeleteShowVM"/><br/>
        venue password: <input id = "venuePasswordDeleteShowVM"/><br/>
        show title: <input id = "showTitleDeleteShowVM"/><br/>
        start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeDeleteShowVM"/><br/>
        <button onClick = {(e) => deleteShow(document.getElementById("venueNameDeleteShowVM").value, 
                                            document.getElementById("venuePasswordDeleteShowVM").value,
                                            document.getElementById("showTitleDeleteShowVM").value,
                                            document.getElementById("showStartTimeDeleteShowVM").value)}>Delete Show</button>
        <p id="showDeleteResultVM"/>

        {/* activate show for venue manager */}
        venue name: <input id = "venueNameActivateShow"/><br/>
        venue password: <input id = "venuePasswordActivateShow"/><br/>
        show title: <input id = "showTitleActivateShow"/><br/>
        start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeActivateShow"/><br/>
        <button onClick = {(e) => activateShow(document.getElementById("venueNameActivateShow").value, 
                                            document.getElementById("venuePasswordActivateShow").value,
                                            document.getElementById("showTitleActivateShow").value,
                                            document.getElementById("showStartTimeActivateShow").value)}>Activate Show</button>
        <p id="showActivateResult"/>

        {/* list shows for venue manager */}
        venue name: <input id = "venueNameListShows"/><br/>
        venue password: <input id = "venuePasswordListShows"/><br/>
        <button onClick = {(e) => listShows(document.getElementById("venueNameListShows").value, 
                                            document.getElementById("venuePasswordListShows").value)}>List Shows</button>
        <p id="showsList"/>

        {/* delete show for admin */}
        admin password: <input id = "adminPassDeleteShowA"/><br/>
        venue name: <input id = "venueNameDeleteShowA"/><br/>
        show title: <input id = "showTitleDeleteShowA"/><br/>
        start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeDeleteShowA"/><br/>
        <button onClick = {(e) => deleteShowAdmin(document.getElementById("adminPassDeleteShowA").value, 
                                                  document.getElementById("venueNameDeleteShowA").value,
                                                  document.getElementById("showTitleDeleteShowA").value,
                                                  document.getElementById("showStartTimeDeleteShowA").value)}>Admin Delete Show</button>
        <p id="showDeleteResultA"/>

        {/* generate shows report for admin */}
        admin password: <input id = "adminPassShowsReport"/><br/>
        <button onClick = {(e) => generateReportAdmin(document.getElementById("adminPassShowsReport").value)}>Admin Shows Report</button>
        <p id="adminShowsReport"/>

        {/* create blocks for venue manager */}
        venue name: <input id = "venueNameCreateBlock"/><br/>
        venue password: <input id = "venuePasswordCreateBlock"/><br/>
        show start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeCreateBlock"/><br/>
        section 'leftSection, centerSection, or rightSection': <input id = "sectionCreateBlock"/><br/>
        start row: <input id = "startRowCreateBlock"/><br/>
        end row: <input id = "endRowCreateBlock"/><br/>
        price: <input id = "priceCreateBlock"/><br/>
        <button onClick = {(e) => createBlock(document.getElementById("venueNameCreateBlock").value,
                                              document.getElementById("venuePasswordCreateBlock").value,
                                              document.getElementById("showStartTimeCreateBlock").value,
                                              document.getElementById("sectionCreateBlock").value,
                                              document.getElementById("startRowCreateBlock").value,
                                              document.getElementById("endRowCreateBlock").value,
                                              document.getElementById("priceCreateBlock").value)}>Create Block</button>
        <p id="createBlockResult"/>

        {/* list blocks for venue manager */}
        venue name: <input id = "venueNameListBlocks"/><br/>
        venue password: <input id = "venuePasswordListBlocks"/><br/>
        show start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeListBlock"/><br/>
        <button onClick = {(e) => listBlocks(document.getElementById("venueNameListBlocks").value, 
                                            document.getElementById("venuePasswordListBlocks").value,
                                            document.getElementById("showStartTimeListBlock").value)}>List Blocks</button>
        <p id="blocksList"/>

         {/* delete blocks for venue manager */}
        venue name: <input id = "venueNameDeleteBlock"/><br/>
        venue password: <input id = "venuePasswordDeleteBlock"/><br/>
        show start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeDeleteBlock"/><br/>
        section 'leftSection, centerSection, or rightSection': <input id = "sectionDeleteBlock"/><br/>
        start row: <input id = "startRowDeleteBlock"/><br/>
        end row: <input id = "endRowDeleteBlock"/><br/>
        <button onClick = {(e) => deleteBlock(document.getElementById("venueNameDeleteBlock").value,
                                              document.getElementById("venuePasswordDeleteBlock").value,
                                              document.getElementById("showStartTimeDeleteBlock").value,
                                              document.getElementById("sectionDeleteBlock").value,
                                              document.getElementById("startRowDeleteBlock").value,
                                              document.getElementById("endRowDeleteBlock").value)}>Delete Block</button>
        <p id="deleteBlockResult"/>

        {/* purchase seats for consumer */}
        venue name: <input id = "venueNamePurchaseSeats"/><br/>
        show start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimePurchaseSeats"/><br/>
        title: <input id = "titlePurchaseSeats"/><br/>
        seats 'columnrow section, ...' (ex. 1B leftSection, 2C rightSection, 4G centerSection): <input id = "seatsPurchaseSeats"/><br/>
        
        <button onClick = {(e) => purchaseSeats(document.getElementById("venueNamePurchaseSeats").value,
                                              document.getElementById("showStartTimePurchaseSeats").value,
                                              document.getElementById("titlePurchaseSeats").value,
                                              document.getElementById("seatsPurchaseSeats").value)}>Purchase Seats</button>
        <p id="purchaseSeatsResult"/>

        {/* show available seats for consumer */}
        venue name: <input id = "venueNameShowSeats"/><br/>
        show start date/time 'YYYY-MM-DD hh:mm:ss': <input id = "showStartTimeShowSeats"/><br/>
        <button onClick = {(e) => showAvailableSeats(document.getElementById("venueNameShowSeats").value,
                                                   document.getElementById("showStartTimeShowSeats").value)}>Show Available Seats</button>
        <p id="showSeatsResult"/>
        
        {/* generate show report for venue manager */}
        venue name: <input id = "venueNameShowsReportVM"/><br/>
        venue password: <input id = "venuePasswordShowsReportVM"/><br/>
        <button onClick = {(e) => generateReportVM(document.getElementById("venueNameShowsReportVM").value,
                                                   document.getElementById("venuePasswordShowsReportVM").value)}>Venue Manager Shows Report</button>
        <p id="showsReportVM"/>

    </div>
  );
}

export default App;
