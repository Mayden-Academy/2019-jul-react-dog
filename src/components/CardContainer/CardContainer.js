import React from 'react'
import Card from "../Card/Card"
import UniqueRandomArray from "unique-random-array"
import Message from '../Message/Message'

const fetchUrl = 'http://localhost:3000/dogs/'

class CardContainer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            dogs: [],
            message: null
        }
    }

    componentDidMount() {
        this.getDogs()
    }

    getDogs = () => {
        fetch(fetchUrl, {
            method: 'get'
        })
            .then(data => data.json())
            .then(res => {
                let state = {message: null}
                if (res.success) {
                    let getRandomDog = UniqueRandomArray(res.data)
                    let dogs = [getRandomDog(), getRandomDog()]
                    state = {...this.state, dogs: dogs, getRandomDog: getRandomDog}
                } else {
                     state = {...this.state, message: 'Sorry, someone let the dogs out. Refresh the page to try again!'}
                }
                this.setState(state)
                }
            )
    }

    sendWinToDb = id => {
        fetch(fetchUrl + id + "/wins", {
            method: 'POST'
        })
    }

    refreshDogs = () => {
        let newDogs = [this.state.getRandomDog(), this.state.getRandomDog()]
        let state = {message: null}
        for (let i = 0; i < 11; i++ ) {
            if (i < 10) {
                if (this.haveDogsChanged(newDogs)) {
                    newDogs = [this.state.getRandomDog(), this.state.getRandomDog()]
                } else {
                    state = {...this.state, dogs: newDogs}
                    break
                }
            }
            state = {...this.state, message: 'We are trying to get you some different dogs but we can\'t find any... maybe they are busy frolicking in the fields. Please refresh the page!'}
        }
        this.setState(state)
    }

    haveDogsChanged(newDogs) {
        if ((newDogs[0]._id == this.state.dogs[0]._id || newDogs[0]._id == this.state.dogs[1]._id)
            && (newDogs[1]._id == this.state.dogs[0]._id || newDogs[1]._id == this.state.dogs[1]._id)) {
            return true
        } else {
            return false
        }
    }

    render() {
        let output = ''
        if (this.state.message) {
            output = <Message text={this.state.message}/>
        }
        else {
            output = this.state.dogs.map(dog => {
                return <Card
                    key={dog.id}
                    name={dog.name}
                    height={dog.height.metric + "cm"}
                    temperament={dog.temperament}
                    id={dog._id}
                    selectWinner={(id)=>{
                        this.sendWinToDb(id)
                        this.refreshDogs()}}/>
            })
        }
        return (
            <div className="card-container">
                {output}
            </div>
        )
    }
}

export default CardContainer
