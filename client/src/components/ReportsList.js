import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Table} from 'react-bootstrap';
import './ReportsList.css';

function ReportsList() {
    const [reports, setReports] = useState([]);
    const [editMode, setEditMode] = useState({status: false, rowid: null, datasaved: false});

    /**
     * Called at render to get the table data.
     */
    const getReports = () => {
        axios
      .get('/api/reports')
      .then((res) => {
          //console.log(res);
          console.log('writing reports to table');
          
          setReports(res.data);
      })
      .catch((err)  => console.log(err));
    };

    const handleAPIError = (error, id) => {
        alert("Something bad happened");
        console.log(error);     // so we can figure out what this object contains
        setEditMode({status:false, rowid: null, datasaved: false});
    }

    /**
     * For a given row, 
     * @param {} event - the event from onClick
     * @param {*} rpt - report data for the row being edited
     */
    const editReport = (event, rpt) => {

        if (editMode.rowid === rpt._id) {
            if (editMode.status)
                return;     // Already editing this row
        } else {
            setEditMode({status: true, rowid: rpt._id, datasaved: false});
        }
    }

    const deleteReport = (event, id) => {
        // from within React, have to use window.confirm, not confirm()
        if (window.confirm("Are you sure you want to delete this report?")) {
            axios.delete(`/api/reports/${id}`)
            .then(data=>setEditMode({status: false, rowid: id, datasaved: true}))
            .catch(error=> handleAPIError(error, id));
        } else {
            cancelEdit(event, id);
        }
       
    }
    const saveReport = (event, rpt) => {
        const id = rpt._id;
        // First, get all input tags
        const rptData = document.getElementsByClassName("editRpt");
        let payload = rpt;
        for (let i=0;i<rptData.length;i++) {
            const input = rptData[i];
            const field = input.name;
            const value = input.value;
            if (value.length > 0 && payload.hasOwnProperty(field))
                payload[field] = value;
        }
        //console.log(payload);
        axios.post(`/api/reports/${id}`, payload)
            .then(data=>setEditMode({status: false, rowid: id, datasaved: true}))
            .catch(error => handleAPIError(error, id));
        
    }
    
    const cancelEdit = (event, id) => {
        setEditMode({status: false, rowid: id, datasaved: false});
    }
    useEffect(() => {
        console.log("Initialization of Reports list");
        getReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editMode]);

    useEffect(() => {
        if (!editMode.status && editMode.datasaved) {
            getReports();
            setEditMode({status:false, rowid: null, datasaved: false});
        }
            
    }, [editMode])
    return (
        <Table bordered hover striped>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Address</th>
                    <th>Rpt ID</th>
                    <th>Co-ordinates</th>
                    <th>Incident Details</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((rpt) => {
                    return (
                    <tr key={rpt._id} onClick={(e) => editReport(e, rpt)}>
                        <td><span title={rpt._id}>{`${rpt._id.substring(0,3)}...`}</span></td>
                        {editMode.status && editMode.rowid === rpt._id ?
                        <>
                            <td>
                                 <input className="editRpt" id='address_string' name='address_string' defaultValue={rpt.address_string}></input>
                            </td>
                            <td>
                                <input className="editRpt" id='bylaw_rpt_id' name='bylaw_rpt_id' defaultValue={rpt.bylaw_rpt_id}></input>
                            </td>
                            <td fieldid='coords'>
                                <input className="editRpt" id='lat' name='lat' defaultValue={rpt.lat}></input>
                                <input className="editRpt" id='lon' name='lon' defaultValue={rpt.lon}></input>
                            </td>
                            <td fieldid='incident_details'>
                                <textarea className="editRpt" name='incident_details' defaultValue={rpt.incident_details}></textarea>
                            </td>
                            <td fieldid="actions">
                                <button className="editBtn" onClick={(event) => saveReport(event, rpt)}>Save</button><br/>
                                <button className="editBtn" onClick={(event) => deleteReport(event, rpt._id)}>Delete</button><br/>
                                <button className="editBtn" onClick={(event) => cancelEdit(event, rpt._id)}>Cancel</button>
                            </td>
                        </>
                        :
                        <>
                            <td>                         
                                <span className="showField" fieldid='address_string'>{rpt.address_string}</span>
                            </td>
                            <td>
                                <span className="showField" fieldid='bylaw_rpt_id'>{rpt.bylaw_rpt_id}</span>
                            </td>
                            <td fieldid='coords'>
                                <span className="showField" fieldid='lat'>{rpt.lat}</span>
                                <span className="showField" fieldid='lon'>{rpt.lon}</span>
                            </td>
                            <td field_id='incident_details'>
                                <span className="showField" fieldid='incident_details'>{rpt.incident_details}</span>
                            </td>
                        </>
                        }
                    </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

export default ReportsList