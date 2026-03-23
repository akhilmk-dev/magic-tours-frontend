"use client";

export const runtime = 'edge';
import React, { useState, useEffect } from 'react';
import CorporateHero from '../../components/Corporate/CorporateHero';
import Solutions from '../../components/Corporate/Solutions';
import Stats from '../../components/Corporate/Stats';

const Corporate = () => {
    return (
        <div className="bg-white">
            <CorporateHero />
            <Solutions />
            <Stats />
        </div>
    );
};

export default Corporate;
