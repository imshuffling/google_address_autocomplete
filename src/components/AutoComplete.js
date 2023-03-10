/* eslint-disable no-sequences */
import { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import { Button, Col, Form, Row } from 'react-bootstrap';
// import './styles.css';

const AutoComplete = () => {
  const [value, setValue] = useState(null);

  const [address, setAddress] = useState({
    streetNumber: '',
    route: '',
    postal_town: '',
    post_town: '',
    postal_code: '',
    locality: '',
    country: '',
  });

  console.log(value);

  useEffect(() => {
    if (!value) return;

    geocodeByPlaceId(value.value.place_id)
      .then((results) => {
        // massaging messy google response
        const addressSanitised = results[0]?.address_components.reduce(
          (seed, { long_name, types }) => (
            types.forEach((t) => (seed[t] = long_name)), seed
          ),
          {}
        );

        console.log('results', results[0]?.address_components);

        console.log('addressSanitised', addressSanitised);

        setAddress({
          streetNumber:
            addressSanitised.street_number ||
            `${addressSanitised.subpremise} ${addressSanitised.premise}`,
          route: addressSanitised.route,
          postal_town: addressSanitised.postal_town,
          post_town: addressSanitised.postal_code,
          postal_code: addressSanitised.postal_code,
          locality: addressSanitised.locality,
          country: addressSanitised.country,
        });
      })
      .catch((error) => console.error(error));
  }, [value]);

  const clearAddress = () => {
    setValue(null);
    setAddress({
      streetNumber: '',
      route: '',
      postal_town: '',
      post_town: '',
      postal_code: '',
      locality: '',
      country: '',
    });
  };

  return (
    <Form>
      <Form.Group className='mb-3'>
        <Form.Label>Address Finder</Form.Label>
        <Row>
          <Col sm={10}>
            <GooglePlacesAutocomplete
              onLoadFailed={(error) =>
                console.error('Could not inject Google script', error)
              }
              apiKey={process.env.REACT_APP_API_KEY}
              className='hello'
              selectProps={{
                value,
                onChange: (e) => {
                  setValue(e);
                  console.log(e);
                },
                placeholder: 'Search address...',
              }}
            />
          </Col>
          <Col sm={2}>
            <Button onClick={clearAddress}>Clear</Button>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className='mb-2'>
        <Form.Label>Address Line 1</Form.Label>
        <Form.Control
          type='text'
          value={address.streetNumber}
          onChange={(e) =>
            setAddress({ ...address, streetNumber: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>Address Line 2</Form.Label>
        <Form.Control
          type='text'
          value={address.route}
          onChange={(e) => setAddress({ ...address, route: e.target.value })}
        />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>Address Line 3</Form.Label>
        <Form.Control
          type='text'
          value={address.postal_town}
          onChange={(e) =>
            setAddress({ ...address, postal_town: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>City</Form.Label>
        <Form.Control
          type='text'
          value={address.locality}
          onChange={(e) => setAddress({ ...address, locality: e.target.value })}
        />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>Post code</Form.Label>
        <Form.Control
          type='text'
          value={address.postal_code}
          onChange={(e) =>
            setAddress({ ...address, postal_code: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className='mb-2'>
        <Form.Label>Country</Form.Label>
        <Form.Control
          type='text'
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
        />
      </Form.Group>
    </Form>
  );
};

export default AutoComplete;
