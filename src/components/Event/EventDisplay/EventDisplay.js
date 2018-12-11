import React, { Component } from 'react';
import './EventDisplay.scss'; 
import { connect } from 'react-redux';
import { loginUser } from '..//..//..//ducks/reducer'; 
import { logoutUser } from '..//..//..//ducks/reducer'; 
import { Link } from 'react-router-dom'; 
import EventHeader from '..//EventHeader.js'; 
import Slider from 'react-slick'; 
//images
import axios from 'axios'; 
import matrix from '..//..//..//images/matrix.jpg'; 
import userImage from '..//..//..//images/user.png'; 
import clock from '..//..//..//images/clock.png';
import marker from '..//..//..//images/marker.png'; 

//Map
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import Geocode from "react-geocode"


class EventDisplay extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            user: null, 
            event: null, 
            attendees: [],

            //Map stuff
            loadLat: 33.4483771,
            loadLng: -112.0740373,
            markerClicked: false,
            markerEventTitle: '',
            markerEventAddress: '',
            showInfoWindow: false,
            activeMarker: {}
        }

        //this.geocodeConfig()
    }

    //Lifecycle
    componentDidMount() {
        this.fetchEvent()
        //this.fetchAttendees() //TEST
    }

    geocodeConfig = () => {
       Geocode.setApiKey(process.env.REACT_APP_MAPS_API_KEY)
    }

    fetchAttendees = () => {
        this.setState({
            attendees: [{ name: "John", imageURL: userImage },
                { name: "Ethan", imageURL: userImage },
                { name: "Joe", imageURL: userImage },
                { name: "Mary", imageURL: userImage },
                { name: "Denise", imageURL: userImage },
                { name: "Bob", imageURL: userImage },
                { name: "Matt", imageURL: userImage },
                { name: "Travis", imageURL: userImage },
                { name: "Daniel", imageURL: userImage },
                { name: "Julia", imageURL: userImage },
                { name: "Mark", imageURL: userImage },
                { name: "Dan", imageURL: userImage },
                { name: "Jake", imageURL: userImage },
                { name: "Chad", imageURL: userImage },
                { name: "Maria", imageURL: userImage }]
        })
    }

    fetchEvent = () => {
        axios.get(`/api/event/${this.props.match.params.id}`).then(response => {
            console.log('response data', response.data)
            this.setState({ event: response.data[0] }, () => {
                this.fetchAttendees()
            })
        }).catch(error => {
            console.log('error fetching event', error)
        })
    }

    fetchAttendees = () => {
        if (this.state.event === null) { return }
        axios.get(`/api/events/attendees/${this.state.event.id}`).then(response => {
            console.log('attendees', response.data)
            this.setState({ attendees: response.data })
        }).catch(error => {
            console.log('error fetching attendees front end', error)
        })
    }

    attendHandler = (going) => {
        if (this.state.event === null || this.props.user === null) { return }
        if (going === true) {
            axios.post(`/api/events/attending/${this.state.event.id}/${this.props.user.id}`).then(response => {
                console.log('response going', response)
            }).catch(error => {
                console.log('error attending front end', error)
            })
        } else {
            axios.delete(`/api/events/attending/${this.state.event.id}/${this.props.user.id}`).then(response => {
                console.log('response removing attendance', response)
            }).catch(error => {
                console.log('error removing attendance front end', error)
            })
        }
    }

    render() {

        const { user } = this.props; 
        const { event, attendees, loadLat, loadLng, markerArray, markerEventTitle, markerEventAddress } = this.state; 
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        }
    
        const urlToGoTo = event != null ? `/chat/${event.socket_room}` : ``

        // Map attendees here
        const attendeesMapped = attendees.map((item, index) => {
            return <div key={item} className="attendee_card_container">
                <div className="attendee_card">
                    <img src={ userImage }></img>
                    <p>{ item.email }</p>
                </div>
            </div>
        })
        console.log('attendees mapped', attendeesMapped)
        console.log('attendees from render()', attendees)

        //Does .some() work on all browsers? 
        const userId = user ? user.id : "" 
        const isGoing = attendees.some(function(o) { return o["id"] === userId })
        console.log('is going', isGoing)

        //Pass bool prop as string
        return (
            <div className="main_container">
                <EventHeader going={isGoing ? "true" : "false"} event={this.state.event} attendFn={this.attendHandler}></EventHeader>
                <div className="event_body_parent">
                    <div className="left_container">
                        <img src={matrix}></img>
                        <p>Description: 
                            Here is a description about the event
                            This event will be just awesome! :)
                        </p>
                        <div className="attendee_container">
                            <p>Attending</p>
                            <Slider className="slick_slider" {...settings}>
                                { attendeesMapped }
                            </Slider>
                        </div>
                        <div className="button_options_container">
                            <button>Photos</button>
                            <Link to={urlToGoTo}><button>Chat</button></Link>
                        </div>
                    </div>
                    <div className="right_container">
                        <div className="map_address_container">
                            <div className="top_image_and_text">
                                <img src={clock}></img>
                                <div>
                                    <p>Monday, December 10, 2018</p>
                                    <p>6:00 PM to 9:00 PM</p>
                                    <button>Add to calendar</button>
                                </div>
                            </div>
                            <div className="top_image_and_text">
                                <img src={marker}></img>
                                <div>
                                    <button>Galvanize San Francisco - Soma</button>
                                    <p>44 Tehama St, San Francisco, CA </p>
                                    <p>94105 · San Francisco, CA</p>
                                    <p>How to find us</p>
                                    <p>We are hosting the event in the </p>
                                    <p>Speakeasy room in the lower level.</p>
                                </div>
                            </div>
                            <div className="map_container">
                                <Map className="mini_map-box" 
                                    google={this.props.google} 
                                    zoom={13.5}
                                    center={{
                                        lat: loadLat,
                                        lng: loadLng
                                    }}
                                    initialCenter={{
                                        lat: loadLat,
                                        lng: loadLng
                                    }}>
                                    <InfoWindow 
                                        marker={this.state.activeMarker}
                                        visible={this.state.showInfoWindow}
                                        onClose={this.onInfoWindowClose}>
                                        <h1>{markerEventTitle}</h1>
                                        <p>{markerEventAddress}</p>
                                        <a href="x">This is a link</a>
                                    </InfoWindow>
                                </Map>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// Event props
//(owner_id, title, description, address, location, start_time, end_time, socket_room)

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const childHOC = GoogleApiWrapper({ apiKey: (process.env.REACT_APP_MAPS_API_KEY)})(EventDisplay)
export default connect(mapStateToProps, { loginUser, logoutUser })(childHOC); 