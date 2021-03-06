import React from 'react';
import { Text } from 'react-native'

import { mount } from 'enzyme';

import { LanguageProvider, getRedirection, TransText, getRedirectionWithLang } from '../src/index';




// Raw datas for differents languages
containers_EN = ["Bottle", "Pack", "Bag", "Box"]
containers_FR = ["Bouteille", "Paquet", "Sachet", "Boite"]

//Dictionary using raw datas
const containers = {
    normal:{
        "en-US" : containers_EN,
        "fr-FR" : containers_FR,
    },
    wrong:{
        "es-ES" : containers_FR,
        "de-DE" : containers_FR,
    },
    withDefault:{
        "es-ES" : containers_FR,
        "en-US" : containers_EN,
    },
}


const translations = {
    juiceText : {
        "en-US" : "Let's drink some Juice, I have 1 {container}",
        "fr-FR" : "Buvons du jus, j'en ai 1 {container}",
    }
}

class TestClassNormal extends React.Component {
    constructor(props){
        super(props)
        this.containerList = getRedirection(containers.normal)
    }
    render(){
        return(<TransText dictionary = {translations.juiceText} values={{"container":this.containerList[0]}} /> )
    }
}

class TestClassNoDic extends React.Component {
    constructor(props){
        super(props)
        this.containerList = getRedirection()
    }
    render(){
        return(<TransText dictionary = {translations.juiceText} values={{"container":this.containerList[0]}} /> )
    }
}

class TestClassWrongDic extends React.Component {
    constructor(props){
        super(props)
        this.containerList = getRedirection(containers.wrong)
    }
    render(){
        return(<TransText dictionary = {translations.juiceText} values={{"container":this.containerList[0]}} /> )
    }
}

class TestClassDefaultLang extends React.Component {
    constructor(props){
        super(props)
        this.containerList = getRedirection(containers.withDefault)
    }
    render(){
        return(<TransText dictionary = {translations.juiceText} values={{"container":this.containerList[0]}} /> )
    }
}

class TestClassNoContext extends React.Component {
    constructor(props){
        super(props)
        this.containerList = getRedirection(containers.withDefault)
    }
    render(){
        return(<Text>{this.containerList[0]}</Text>)
    }
}

class WithLangtest extends React.Component {
  constructor(props){
      super(props)
      this.state = {
        bottle : getRedirectionWithLang("fr-FR",containers.normal)[0]
      }
  }
  render(){
      return(<></>)
  }
}


/*
* Testing normal use
*/
describe('getRedirection normal use', () => {
    it('should render using getRedirection in french', () => {
      const wrapper = mount(
        <LanguageProvider language = {"fr-FR"}>
          <TestClassNormal/>
        </LanguageProvider>
      )
      wrapper.mount();
      expect(wrapper.find(TransText).children().find(Text).text()).toContain("Bouteille");
    });
  });

/*
* Testing no dic
*/
describe('getRedirection with no dic', () => {
  it('Should render using getRedirection with undefined', () => {
    const wrapper = mount(
      <LanguageProvider language = {"fr-FR"}>
        <TestClassNoDic/>
      </LanguageProvider>
    )
    wrapper.mount();
    expect(wrapper.find(TransText).children().find(Text).text()).toContain("undefined");
  });
});

/*
* Testing wrong dic
*/
describe('getRedirection wrong dic', () => {
    it('Should render using getRedirection with undefined', () => {
      const wrapper = mount(
        <LanguageProvider language = {"fr-FR"}>
          <TestClassWrongDic/>
        </LanguageProvider>
      )
      wrapper.mount();
      expect(wrapper.find(TransText).children().find(Text).text()).toContain("undefined");
    });
  });

  /*
* Testing wrong dic but default language found
*/
describe('getRedirection wrong dic but default language found', () => {
    it('Should render using getRedirection with default language', () => {
      const wrapper = mount(
        <LanguageProvider language = {"fr-FR"}>
          <TestClassDefaultLang/>
        </LanguageProvider>
      )
      wrapper.mount();
      expect(wrapper.find(TransText).children().find(Text).text()).toContain("Bottle");
    });
  });

    /*
* Testing with undefined context
*/
describe('getRedirection with undefined context', () => {
    it('Should render using getRedirection with default language (no provider)', () => {
      const wrapper = mount(
          <TestClassNoContext/>
      )
      wrapper.mount();
      expect(wrapper.find(Text).text()).toContain("Bottle");
    });
  });


/*
* Testing with lang
*/
describe('getRedirection with lang', () => {
  it('should get redirection on state', () => {
    const wrapper = mount(
        <WithLangtest/>
    )
    wrapper.mount();
    expect(wrapper.state('bottle')).toEqual("Bouteille");
  });
});