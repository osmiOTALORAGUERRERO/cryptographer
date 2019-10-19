/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Component} from 'react';
import './App.css';
import './css/normalize.css'
import './css/skeleton.css'
import Criptografo from './Criptografo.js'

class App extends Component {
  
  constructor(props){
    super(props)
    this.handleSymmetricEncryption = this.handleSymmetricEncryption.bind(this)
    this.handleAsymmetricEncryption = this.handleAsymmetricEncryption.bind(this)
    this.state = {encriptation: 's'}
  }
  
  handleSymmetricEncryption(e) {
    e.preventDefault()
    this.setState({encriptation: 's'})
  }
  
  handleAsymmetricEncryption(e) {
    e.preventDefault()
    this.setState({encriptation: 'a'})
  }

  render() {
    const encriptation = this.state.encriptation

    return (
      <div>
        <header className="App-header">
          <ul>
            <li>
              <a 
                href="#" 
                onClick={this.handleSymmetricEncryption} 
                className="App-link"
                encriptation = 's'
              >
                  Simetrico
              </a>
            </li>
            <li>
             <a href="#" onClick={this.handleAsymmetricEncryption} className="App-link" encriptation = 'a'>Asimetrico</a>
            </li>
          </ul>
        </header>
        <div className='App container'>
          <Criptografo type={encriptation}/>
        </div>
      </div>
    ) 
  }
}

export default App;
