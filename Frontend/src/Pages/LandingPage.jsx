

import HeaderMarqee from "../Component/headerMarquee";
import HeaderBtn from "../Component/HeaderBtn";
import MainBody from "../Component/MainBody";
import Nextmarqee from "../Component/Nextmarqee";
import Section2 from "../Component/Section2";
import Footer from "../Component/Footer";

import { useSelector } from "react-redux";

import Axios from "../Utils/axios"
export default function LandingPage() {

     


    // const getUser = Axios.get('')
    return (
        <>
            <HeaderMarqee />
            <HeaderBtn />
            <MainBody />
            <Nextmarqee/>
            <Section2/>
            <Footer/>
            
        </>

    )
}