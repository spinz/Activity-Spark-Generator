






# Activity Spark Generator

## Overview

**Goal:** To create a simple AI-powered tool that assists Shawna, a K-3 prep teacher, by quickly generating creative and age-appropriate activity ideas for her Art, Dance, Drama, and Physical Education classes. This tool aims to reduce planning time, provide inspiration, and help demonstrate the practical benefits of AI in an educational context.

## Features

### Inputs (User Provides):

The user interface should allow Shawna to specify the following parameters:

1.  **Subject:** Select from a predefined list (e.g., Art, Dance, Drama, Phys Ed).
2.  **Grade Level:** Select from a predefined list (e.g., Kindergarten, Grade 1, Grade 2, Grade 3).
3.  **Theme/Topic (Optional):** A text field to enter a specific theme (e.g., "Spring," "Animals," "Feelings," "Shapes").
4.  **Materials/Constraints (Optional):** A text field to note available resources or limitations (e.g., "paper plates and paint," "beanbags," "outdoor space only," "low energy activity").
5.  **Time Estimate (Optional):** Suggest a duration type (e.g., "Warm-up (5-10 min)," "Main Activity (20-30 min)," "Cool-down (5 min)").

### Outputs (AI Generates):

Upon clicking a "Generate Ideas" button, the tool will display **5 concise activity ideas**. Each idea should include:

1.  **Catchy Title:** Easy to remember and understand.
2.  **Brief Description:** 1-2 sentences outlining the core activity concept.
3.  **Example(s):** A brief example to illustrate the activity in practice.

## Example Usage

*(Here are illustrative examples of potential input/output scenarios)*

**Scenario 1: Art**
* **Input:** Subject: Art, Grade: Kindergarten, Theme: Dinosaurs, Materials: Playdough
* **Output:**
    1.  **Dino Footprints:** Press toy dinosaurs into flattened playdough to make track patterns. *Example: See how many different footprints you can make!*
    2.  **Fossil Fun:** Press shells, leaves, or small toys into playdough discs to create 'fossils'. *Example: Pretend you're archaeologists digging for fossils.*
    3.  **Stegosaurus Spikes:** Roll small playdough cones and stick them onto a larger rolled body shape. *Example: How many spikes can your stegosaurus have?*
    4.  **Pterodactyl Wings:** Flatten two pieces of playdough into wing shapes and attach to a small body. *Example: Make your pterodactyl look like it's flying!*
    5.  **Volcano Creation:** Build a simple volcano shape; maybe add red/orange playdough 'lava'. *Example: Create a landscape for your dinosaurs.*

**Scenario 2: Dance**
* **Input:** Subject: Dance, Grade: 1, Theme: Weather, Time Estimate: Warm-up (5-10 min)
* **Output:**
    1.  **Sunshine Stretches:** Reach up high like the sun, then slowly bend down low. *Example: Stretch arms wide like sunbeams.*
    2.  **Windy Wobbles:** Sway side to side gently like trees in a breeze, then faster like a strong wind. *Example: Can you sway without falling over?*
    3.  **Raindrop Taps:** Gently tap fingers on shoulders, head, knees, toes like raindrops falling. *Example: Start slow, then make it a downpour!*
    4.  **Snowflake Flutters:** Move lightly on toes, spinning and floating gently like snowflakes. *Example: Try not to bump into other snowflakes.*
    5.  **Thunder Rolls:** Stomp feet firmly on the ground to make a loud thunder sound. *Example: Make soft thunder, then LOUD thunder!*

**Scenario 3: Drama**
* **Input:** Subject: Drama, Grade: 3, Theme: Fantasy Creatures
* **Output:**
    1.  **Dragon's Treasure:** Act out being a dragon guarding its precious treasure pile. *Example: Show how you'd scare away a knight.*
    2.  **Fairy Flight School:** Pretend to be fairies learning to fly, practicing fluttering and gliding. *Example: Show a clumsy landing or a graceful takeoff.*
    3.  **Goblin Market:** Act out being mischievous goblins trying to trade funny items. *Example: What strange things would a goblin sell?*
    4.  **Unicorn Encounter:** Show how you would react if you suddenly met a gentle unicorn in the forest. *Example: Would you be scared, curious, or happy?*
    5.  **Grumpy Troll Bridge:** Take turns being a grumpy troll under a bridge, questioning others who want to cross. *Example: Use a deep, grumpy voice.*

**Scenario 4: Phys Ed**
* **Input:** Subject: Phys Ed, Grade: 2, Materials: Cones, Hoops
* **Output:**
    1.  **Cone Weaving Race:** Weave in and out of a line of cones, run back. *Example: Race against another line or time yourself.*
    2.  **Hoop Target Toss:** Try tossing beanbags (or soft balls) into hoops placed at different distances. *Example: Assign points for different hoops.*
    3.  **Island Hop:** Scatter hoops ("islands") on the floor. Kids jump from hoop to hoop without touching the "water". *Example: Try hopping on one foot.*
    4.  **Cone Collection Relay:** Teams race to collect cones one by one and bring them back to their team hoop. *Example: First team to collect all their cones wins.*
    5.  **Obstacle Course:** Create a simple course using cones to run around and hoops to jump into/through. *Example: Time how fast each student can complete it.*

## Curriculum Connections (Ontario / YRDSB)

While this tool generates ideas, alignment with specific curriculum expectations requires teacher judgment. Shawna can use the generated ideas as starting points and adapt them to meet learning goals from the Ontario curriculum.

**Relevant Curriculum Resources Found:**

* **Ontario Arts Curriculum (Grades 1-8):** [The Arts - Curriculum and Resources](https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-arts) (Provides links to Grade 1, 2, 3 PDFs)
* **Ontario Health and Physical Education (Grades 1-8):**
    * [Overview of Grades 1-3](https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-health-and-physical-education/grades/grade-2/overview-of-grades-1-to-3)
    * [The Strands](https://www.dcp.edu.gov.on.ca/en/curriculum/elementary-health-and-physical-education/context/the-strands-in-the-health-and-physical-education-curriculum)
    * [TVO Learn - Grade 3 H&PE](https://tvolearn.com/pages/grade-3-health-and-physical-education)
* **YRDSB Resources:**
    * [YRDSB Kindergarten Program Info](https://www2.yrdsb.ca/schools-programs/elementary-school/kindergarten) & [Program Details](https://www2.yrdsb.ca/schools-programs/elementary-school/kindergarten/kindergarten-program)
    * [YRDSB Elementary Arts Overview](https://www2.yrdsb.ca/schools-programs/school-programs-nav/school-programs/arts/arts-elementary)
    * [YRDSB Arts Education Policy](https://www2.yrdsb.ca/PP-301-ArtsEducation)
    * [YRDSB Revised H&PE Curriculum Info](https://www2.yrdsb.ca/about-us/departments/curriculum-instructional-services/revised-health-and-physical-education)

*(Note: Some useful resources like lesson plans might also be found on platforms like Teachers Pay Teachers, as seen in the search results, but official curriculum documents are the primary reference.)*

## Development Notes

**Phase 1: Simulation (Proof of Concept)**
* Use a general AI chatbot (like Gemini, ChatGPT) to manually simulate the tool's function.
* Input prompts based on the defined features (Subject, Grade, Theme, etc.).
* Evaluate the quality and usefulness of the generated ideas *with Shawna*.
* Refine prompts based on feedback.

**Phase 2: Simple Interface (Potential Build)**
* If simulation is successful and valued, create a basic web interface (HTML, CSS, JavaScript).
* Interface should include dropdowns/text fields for inputs and a display area for outputs.
* Connect the interface to an AI model API (e.g., Gemini API, OpenAI API) to handle the generation logic.
* Keep the initial build focused strictly on the core generation function. No user accounts, saving, or complex features initially.
