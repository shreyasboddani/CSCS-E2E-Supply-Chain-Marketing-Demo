# Presenting the SCOTI marketing demo

Target: a 5-10 minute walkthrough. All operational data is fictional and the interface is an original concept.

1. Open `/`. Introduce the connected operation in the 3D overview.
2. In **Look closer**, choose **Inside the warehouse** to lift the roof; use the rotation buttons or drag the model. Choose **Beyond the loading dock** to inspect the transport connection.
3. Scroll into planning. Explain forecast + target - available. The initial values are 120 + 20 - 40 = 100.
4. Continue through the warehouse sequence. Scroll controls camera and roof presentation; it does not change scenario state.
5. Select the seven stage explanations, or open a stage for a deeper operational view.
6. In **Your turn**, run each decision: approve replenishment, confirm PO, receive inventory, allocate order, start picking, complete pick/pack, dispatch, in transit, out for delivery, confirm delivery.
7. Show the stock changes: 40 initially; 140 after receipt; 140 on hand / 2 reserved / 138 available after allocation; 138 on hand / 0 reserved after dispatch. The truck position reflects shipment progression.
8. Open **Control Tower**. The same completed scenario and activity history remain available. The console also works from this screen.
9. Reset the scenario with confirmation when preparing another demonstration. Reset returns stock and event history to the canonical seed.

## Workspace entry points

`/demo/intro` provides a spatial overview and module shortcuts. `/demo/inbound` includes the open-roof warehouse. `/demo/control-tower` brings the model, lifecycle console, inventory, and event history together. The original direct stage URLs remain supported.

## Recording and review

Use a clean browser session or reset before recording. Keep the concept/simulated-data disclosure in the experience. Complete a browser visual pass before external release: hero, roof reveal, all actions, workspace handoff, reset, keyboard controls, narrow screens, and reduced motion. This release's browser review is pending until the Browser plugin has a connected browser; no screenshot-based approval has been claimed.


## Guided spotlight over the original workspace

Select Guided to open the tour on the current stage. Use Show me what to review,
then Show me the action. Click the original highlighted action button. The guide
explains the latest recorded event and provides the next handoff. For pick/pack
and shipment, Explain the next action continues within the current stage.
See this connection in 3D expands an optional illustration. Escape closes the
guide; Explore keeps the same scenario and original controls. Reset demo keeps
its confirmation dialog. All seven business stages and the intro remain intact.
