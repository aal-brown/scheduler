import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, waitForElementToBeRemoved, getAllByText, getByTestId } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

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
    const appointment = appointments[1];
    // 3. Click the delete button on the booked appointment.
    fireEvent.click(getByText(appointment, "Delete"))
    // 4. Check that the confirmation message is shown
    await waitForElement(() => getByTestId(appointment, "confirm"));

    // 5. Click the confirm button
    fireEvent.click(getByText(appointment, "Delete"))
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment,"Saving")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "confirm"));
    // 8. Check that the DayListItem with the text "Monday" has the text "2 spots remaining"

    const day = getAllByTestId(container, "day").find((element) => {
      return queryByText(element,"Monday")
    })
    
    expect(getByText(day,"2 spots remaining")).toBeInTheDocument()
  });
  

});