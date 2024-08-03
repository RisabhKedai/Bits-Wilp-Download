import asyncio
import websockets

async def hello():
    async with websockets.connect('ws://localhost:8765') as websocket:
        await websocket.send("Hello, WebSocket!")
        response = await websocket.recv()
        print(response)

asyncio.run(hello())