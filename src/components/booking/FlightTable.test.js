import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import FlightTable from "./FlightTable";
import SeatClass from "./SeatClass";

it("renders info for flight with economy seat class", async () => {
    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const departureFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const returnFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.ECONOMY;
    const pricePerPassenger = 1;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            departureFlight={departureFlight}
            returnFlight={returnFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
    );

    expect(screen.getByText("(ABC)")).toBeInTheDocument();
    expect(screen.getByText("1 hr 0 min")).toBeInTheDocument();
    expect(screen.getByText("economy")).toBeInTheDocument();
});

it("renders info for flight with business seat class", async () => {
    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const departureFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const returnFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.BUSINESS;
    const pricePerPassenger = 1;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            departureFlight={departureFlight}
            returnFlight={returnFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
    );

    expect(screen.getByText("(ABC)")).toBeInTheDocument();
    expect(screen.getByText("1 hr 0 min")).toBeInTheDocument();
    expect(screen.getByText("business")).toBeInTheDocument();
});

it("renders info for flight with first seat class", async () => {
    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const departureFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const returnFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.FIRST;
    const pricePerPassenger = 1.00;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            departureFlight={departureFlight}
            returnFlight={returnFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
    );

    expect(screen.getByText("(ABC)")).toBeInTheDocument();
    expect(screen.getByText("2:00 am")).toBeInTheDocument();
    expect(screen.getByText("1 hr 0 min")).toBeInTheDocument();
    expect(screen.getByText("first")).toBeInTheDocument();
});

it("has a check-in group", async () => {
    const handleUpgrade = jest.fn(15, 1);
    const setUpgradesPricePP = jest.fn();
    const setCheckInGroup = jest.fn();

    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const departureFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const returnFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.ECONOMY;
    const pricePerPassenger = 1.00;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    const checkInGroup = 3
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            departureFlight={departureFlight}
            returnFlight={returnFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
            setCheckInGroup={setCheckInGroup}
            checkInGroup={checkInGroup}
            setUpgradesPricePP={setUpgradesPricePP}
        />
    );

    expect(checkInGroup).toBe(3);

})
