using System;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Server.App.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            if (message.Contains("Hello there"))
            {
                await Clients.All.SendAsync("ReceiveMessage", user, "General Kenobi ...").ConfigureAwait(false);
            }
        }
    }
}