import React from 'react';
import { Navbar } from '../NavbarAndFooter/Navbar';
import { ExploreTopBooks } from './Components/ExploreTopBooks';
import { Carousel } from './Components/Carousel';
import { Footer } from './Components/Footer';
import { Heros } from './Components/Heros';
import { LibraryServices } from './Components/LibraryServices';

export const HomePage = () => {
    return (
        <>
            <ExploreTopBooks />
            <Carousel />
            <Heros />
            <LibraryServices />
        </>
    )
} 