import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import FlightList from "../flight-list/FlightList";

it("calls #onFlightSelection when sort dropdown is changed", async () => {
    const onDeparturesSortBy = jest.fn();

    // flights
    const flight = {
        id: 1,
        airplane: {
            id: 16,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 300.00,
        businessReserved: 0,
        businessPrice: 200.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:21,
            originAirport: {
                iataId: "JFK",
                city: "New York City",
                isActive:true
            },
            destinationAirport: {
                iataId: "LAX",
                city: "Los Angeles",
                isActive: true
            },
                isActive: true
            }
    };
    const departureFlight = {
        id: 1,
        airplane: {
            id: 16,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 300.00,
        businessReserved: 0,
        businessPrice: 200.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:21,
            originAirport: {
                iataId: "JFK",
                city: "New York City",
                isActive:true
            },
            destinationAirport: {
                iataId: "LAX",
                city: "Los Angeles",
                isActive: true
            },
                isActive: true
            }
    };
    const returnFlight = {
        id: 1,
        airplane: {
            id: 16,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 300.00,
        businessReserved: 0,
        businessPrice: 200.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:21,
            originAirport: {
                iataId: "JFK",
                city: "New York City",
                isActive:true
            },
            destinationAirport: {
                iataId: "LAX",
                city: "Los Angeles",
                isActive: true
            },
                isActive: true
            }
    };

    // flight pages
    const flightPage = {
        content:[
            {
                id: 35,
                airplane: {
                    id: 16,
                    firstClassSeatsMax:20,
                    businessClassSeatsMax:50,
                    economyClassSeatsMax:280,
                    model: "Airbus A220"
                },
                departureTime: "2021-08-07T16:15:00.000+00:00",
                arrivalTime: "2021-08-07T17:33:00.000+00:00",
                firstReserved:0,
                firstPrice:300.0,
                businessReserved:0,
                businessPrice:250.53,
                economyReserved:0,
                economyPrice:200.4,
                isActive: true,
                route: {
                    id:21,
                    originAirport: {
                        iataId: "JFK",
                        city: "New York City",
                        isActive: true
                    },
                    destinationAirport: {
                        iataId: "LAX",
                        city: "Los Angeles",
                        isActive: true
                    },
                    isActive: true
                }
            }
        ],
        pageable: {
            sort: {
                sorted: true,
                unsorted: false,
                empty: false
            },
            offset:0,
            pageNumber:0,
            pageSize:10,
            paged:true,
            unpaged:false},
            last:true,
            totalPages:1,
            totalElements:1,
            numberOfElements:1,
            sort: {
                sorted:true,
                unsorted:false,
                empty:false
            },
            size:10,
            number:0,
            first:true, 
            empty: false
        };
    
        const departureFlightPage = {
            content:[
                {
                    id: 35,
                    airplane: {
                        id: 16,
                        firstClassSeatsMax:20,
                        businessClassSeatsMax:50,
                        economyClassSeatsMax:280,
                        model: "Airbus A220"
                    },
                    departureTime: "2021-08-07T16:15:00.000+00:00",
                    arrivalTime: "2021-08-07T17:33:00.000+00:00",
                    firstReserved:0,
                    firstPrice:300.0,
                    businessReserved:0,
                    businessPrice:250.53,
                    economyReserved:0,
                    economyPrice:200.4,
                    isActive: true,
                    route: {
                        id:21,
                        originAirport: {
                            iataId: "JFK",
                            city: "New York City",
                            isActive: true
                        },
                        destinationAirport: {
                            iataId: "LAX",
                            city: "Los Angeles",
                            isActive: true
                        },
                        isActive: true
                    }
                }
            ],
            pageable: {
                sort: {
                    sorted: true,
                    unsorted: false,
                    empty: false
                },
                offset:0,
                pageNumber:0,
                pageSize:10,
                paged:true,
                unpaged:false},
                last:true,
                totalPages:1,
                totalElements:1,
                numberOfElements:1,
                sort: {
                    sorted:true,
                    unsorted:false,
                    empty:false
                },
                size:10,
                number:0,
                first:true, 
                empty: false
            };

    const returnFlightPage = {
                content:[
                    {
                        id: 35,
                        airplane: {
                            id: 16,
                            firstClassSeatsMax:20,
                            businessClassSeatsMax:50,
                            economyClassSeatsMax:280,
                            model: "Airbus A220"
                        },
                        departureTime: "2021-08-07T16:15:00.000+00:00",
                        arrivalTime: "2021-08-07T17:33:00.000+00:00",
                        firstReserved:0,
                        firstPrice:300.0,
                        businessReserved:0,
                        businessPrice:250.53,
                        economyReserved:0,
                        economyPrice:200.4,
                        isActive: true,
                        route: {
                            id:21,
                            originAirport: {
                                iataId: "JFK",
                                city: "New York City",
                                isActive: true
                            },
                            destinationAirport: {
                                iataId: "LAX",
                                city: "Los Angeles",
                                isActive: true
                            },
                            isActive: true
                        }
                    }
                ],
                pageable: {
                    sort: {
                        sorted: true,
                        unsorted: false,
                        empty: false
                    },
                    offset:0,
                    pageNumber:0,
                    pageSize:10,
                    paged:true,
                    unpaged:false},
                    last:true,
                    totalPages:1,
                    totalElements:1,
                    numberOfElements:1,
                    sort: {
                        sorted:true,
                        unsorted:false,
                        empty:false
                    },
                    size:10,
                    number:0,
                    first:true, 
                    empty: false
                };

                let departureTrip = [flight];
                let returnTrip = [returnFlight];

    render(
        <FlightList 
                flight={flight} 
                flightPage={flightPage} 
                departureFlight={departureFlight} 
                departureFlightPage={departureFlightPage}
                returnFlight={returnFlight} 
                returnFlightPage={returnFlightPage}
                onDeparturesSortBy={onDeparturesSortBy}
                selectedDepTrip={departureTrip} 
                selectedRetTrip={returnTrip}/>
    );

    fireEvent.change(screen.getByTestId('search-1'), { target: { value: 'departureTime' } })
    expect(onDeparturesSortBy).toHaveBeenCalled();
})