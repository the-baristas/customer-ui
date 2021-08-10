import Card from "react-bootstrap/Card";

const CheckInGroupUpgrade = (props) => {
    // Callbacks

    const handleClick = (amount, group) => {
        props.onCheckInGroupUpgrade(amount, group);
    };

    return (
        <Card className="check-in-group-upgrade">
            <Card.Body>
                <Card.Title>Upgrade Boarding Group?</Card.Title>
                <p>
                    <small>
                        Your boarding group is based on your seat class.
                        Priority boarding is given to Group 1, which is followed
                        by Group 2, and then Group 3. By upgrading your group,
                        you can be amongst the first to stow your carry-on
                        baggage and board the flight.
                    </small>
                </p>
                <Card.Link className="point" onClick={() => handleClick(15, 1)}>
                    Upgrade To Group 1
                </Card.Link>
                {props.checkInGroup !== 2 && (
                    <Card.Link
                        className="point"
                        onClick={() => handleClick(12, 2)}
                    >
                        Upgrade To Group 2
                    </Card.Link>
                )}
            </Card.Body>
        </Card>
    );
};

export default CheckInGroupUpgrade;
