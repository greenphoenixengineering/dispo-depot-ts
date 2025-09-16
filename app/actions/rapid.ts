"use server";

import axios from 'axios';

export interface PropertyDetails {
  address: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  yearBuilt?: number;
  lotSize?: number;
  propertyType?: string;
  price?: number;
  lat?: number;
  lon?: number;
  photos?: string[];
  zestimate?: number;
  rentZestimate?: number;
  lastSoldPrice?: number;
  lastSoldDate?: string;
  propertyTaxRate?: number;
  propertyTaxAmount?: number;
  neighborhood?: string;
  schoolDistrict?: string;
  elementarySchool?: string;
  middleSchool?: string;
  highSchool?: string;
  crimeRate?: number;
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
  // Additional fields that might be useful for ARV calculation
  lotDimensions?: string;
  parkingSpaces?: number;
  heatingType?: string;
  coolingType?: string;
  roofType?: string;
  exteriorMaterial?: string;
  foundationType?: string;
  basement?: boolean;
  garage?: boolean;
  pool?: boolean;
  fireplace?: boolean;
  centralAir?: boolean;
  // Market analysis fields
  daysOnMarket?: number;
  priceHistory?: Array<{
    date: string;
    price: number;
    event: string;
  }>;
  comparableProperties?: Array<{
    address: string;
    price: number;
    beds: number;
    baths: number;
    sqft: number;
    distance: number;
  }>;
}

export async function getPropertyDetails(address: string): Promise<PropertyDetails | null> {
  try {
    const options = {
      method: 'GET',
      url: `${process.env.property_url}` + '/search_address',
      params: {
        address: address
      },
      headers: {
        'x-rapidapi-key': `${process.env.x_rapidapi_key}`,
        'x-rapidapi-host': `${process.env.x_rapidapi_host}`
      }
    };

    const response = await axios.request(options);
    console.log('RapidAPI Response:', response.data);
    
    // Extract property details from the response
    const data = response.data;
    
    // Create property details object with extracted data
    const propertyDetails: PropertyDetails = {
      address: address,
      // Basic property info
      beds: data.bedrooms || data.beds || data.bed,
      baths: data.bathrooms || data.baths || data.bath,
      sqft: data.squareFootage || data.sqft || data.livingArea,
      yearBuilt: data.yearBuilt || data.constructionYear,
      lotSize: data.lotSize || data.acres || data.lotSquareFootage,
      propertyType: data.propertyType || data.homeType || data.residenceType,
      
      // Pricing information
      price: data.price || data.listPrice || data.askingPrice,
      zestimate: data.zestimate || data.zillowEstimate,
      rentZestimate: data.rentZestimate || data.rentalEstimate,
      lastSoldPrice: data.lastSoldPrice || data.previousSalePrice,
      lastSoldDate: data.lastSoldDate || data.previousSaleDate,
      
      // Location coordinates
      lat: data.latitude || data.lat,
      lon: data.longitude || data.lng || data.lon,
      
      // Visual assets
      photos: data.photos || data.images || data.pictureUrls || [],
      
      // Tax and financial
      propertyTaxRate: data.propertyTaxRate || data.taxRate,
      propertyTaxAmount: data.propertyTaxAmount || data.annualTaxes,
      
      // Neighborhood and schools
      neighborhood: data.neighborhood || data.area || data.community,
      schoolDistrict: data.schoolDistrict || data.district,
      elementarySchool: data.elementarySchool || data.primarySchool,
      middleSchool: data.middleSchool || data.juniorHigh,
      highSchool: data.highSchool || data.seniorHigh,
      
      // Market metrics
      crimeRate: data.crimeRate || data.safetyScore,
      walkScore: data.walkScore || data.walkabilityScore,
      transitScore: data.transitScore || data.transitAccessibility,
      bikeScore: data.bikeScore || data.bikeabilityScore,
      
      // Property features
      lotDimensions: data.lotDimensions || data.dimensions,
      parkingSpaces: data.parkingSpaces || data.garageSpaces,
      heatingType: data.heatingType || data.heating,
      coolingType: data.coolingType || data.cooling,
      roofType: data.roofType || data.roof,
      exteriorMaterial: data.exteriorMaterial || data.siding,
      foundationType: data.foundationType || data.foundation,
      basement: data.basement || data.hasBasement,
      garage: data.garage || data.hasGarage,
      pool: data.pool || data.hasPool,
      fireplace: data.fireplace || data.hasFireplace,
      centralAir: data.centralAir || data.hasCentralAir,
      
      // Market analysis
      daysOnMarket: data.daysOnMarket || data.marketTime,
      priceHistory: data.priceHistory || data.salesHistory || [],
      comparableProperties: data.comparableProperties || data.comps || []
    };
    
    console.log('Extracted Property Details:', propertyDetails);
    return propertyDetails;
    
  } catch (error) {
    console.error('Error fetching property details:', error);
    return null;
  }
}
