import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, waitForElementToBeRemoved, getAllByText, getByTestId } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

import axios from "axios";

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for the Monday by 1", async () => {

    //Retrieve container and debug
    const { container, debug } = render(<Application />)

    //Don't get container until archi cohen loads
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    //Get the appointments from container
    const appointments = getAllByTestId(container, "appointment");

    //Get the first appointment
    const appointment = appointments[0];
    
    //Click the "Add" button
    fireEvent.click(getByAltText(appointment, "Add"));

    //Get the input by grabbing the placeholder text, then input student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
    });

    //Select the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    //Click save
    fireEvent.click(getByText(appointment, "Save"))
    
    expect(getByText(appointment,"Saving")).toBeInTheDocument();

    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((element) => {
      return queryByText(element,"Monday")
    })
    
    expect(getByText(day,"no spots remaining")).toBeInTheDocument()

  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
      //Get the appointments from container
      const appointments = getAllByTestId(container, "appointment");

    //Get the first booked appointment
    const appointment = appointments.find((item) => {
      return queryByText(item,"Archie Cohen")
    });
    // 3. Click the delete button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"))
    // 4. Check that the confirmation message is shown
    await waitForElement(() => getByText(appointment, "Are you sure you want to delete the appointment?"));

    // 5. Click the confirm button
    fireEvent.click(getByText(appointment, "Confirm"))
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(container,"Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"

    const day = getAllByTestId(container, "day").find((element) => {
      return queryByText(element,"Monday")
    })
    
    expect(getByText(day,"2 spots remaining")).toBeInTheDocument()
  });


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //Get the appointments from container
    const appointments = getAllByTestId(container, "appointment");

    //Get the first booked appointment
    const appointment = appointments.find((item) => {
      return queryByText(item,"Archie Cohen")
    });
    
    // 3. Click the "Edit" button on the booked appointment.
    
    fireEvent.click(getByAltText(appointment, "Edit"))

    // 4. Check that the form element is shown, by checking for student-name-input id.
    await waitForElement(() => getByTestId(appointment, "student-name-input"));

    // 5. Change the name to something else
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Test Test" }
      });

    // 6. Change the interviewer
    //Select the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click the "Save" button on the form.
    fireEvent.click(getByText(appointment, "Save"))

    // 6. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment,"Saving")).toBeInTheDocument();

    // 7. Wait until the element with the new name is displayed.
    await waitForElement(() => getByText(appointment, "Test Test"));

    // 8. Check that the appointment now has the proper interviewer
    expect(getByText(appointment,"Sylvia Palmer")).toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" has the text "1 spot remaining"

    const day = getAllByTestId(container, "day").find((element) => {
      return queryByText(element,"Monday")
    })
    
    expect(queryByText(day,"1 spot remaining")).toBeInTheDocument()

  });


  it("shows the save error when failing to save an appointment", async () => {

  axios.put.mockRejectedValueOnce()
    //Retrieve container and debug
  const { container} = render(<Application />)

  //Don't get container until archi cohen loads
  await waitForElement(() => getByText(container, "Archie Cohen"))
  
  //Get the appointments from container
  const appointments = getAllByTestId(container, "appointment");

  //Get the first appointment
  const appointment = appointments[0];
  
  //Click the "Add" button
  fireEvent.click(getByAltText(appointment, "Add"));

  //Get the input by grabbing the placeholder text, then input student name
  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
  target: { value: "Lydia Miller-Jones" }
  });

  //Select the interviewer
  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
   
  //Click save
  fireEvent.click(getByText(appointment, "Save"))


  //Confirm that saving status shows up
  expect(getByText(appointment,"Saving")).toBeInTheDocument();

  //wait for error
  await waitForElement(() => getByText(appointment, "Error"))

  //Error window should have a close button
  expect(getByAltText(appointment,"Close")).toBeInTheDocument()

  //Click the close button
  fireEvent.click(getByAltText(appointment, "Close"));

  //Expecting form input to show up again
  expect(getByPlaceholderText(appointment, /enter student name/i)).toBeInTheDocument()

  });

  it("shows the save error when failing to delete an appointment", async () => {

    axios.delete.mockRejectedValueOnce()
      //Retrieve container
    const { container} = render(<Application />)
  
    //Don't get container until archi cohen loads
    await waitForElement(() => getByText(container, "Archie Cohen"))
    
    //Get the appointments from container
    const appointments = getAllByTestId(container, "appointment");
  
    //Get the Archie Cohen appointment
    const appointment = appointments[1];
    
    //Click the "Delete" button
    fireEvent.click(getByAltText(appointment, "Delete"))
    //Check that the confirmation message is shown
    await waitForElement(() => getByText(appointment, "Are you sure you want to delete the appointment?"));

    // 5. Click the confirm button
    fireEvent.click(getByText(appointment, "Confirm"))

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(container,"Deleting")).toBeInTheDocument();
      
    //wait for error
    await waitForElement(() => getByText(appointment, "Error"))

    //Error window should have a close button
    expect(getByAltText(appointment,"Close")).toBeInTheDocument()

    //Click the close button
    fireEvent.click(getByAltText(appointment, "Close"));
      
    //Expecting Archie Cohen appointment to still exist
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument()

    //Expect all spots to be the same
    const day = getAllByTestId(container, "day").find((element) => {
      return queryByText(element,"Monday")
    })
    
    expect(getByText(day,"1 spot remaining")).toBeInTheDocument()

    });

});