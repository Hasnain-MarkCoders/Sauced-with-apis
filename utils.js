import sauce1 from "./assets/images/sauce1.png"
import sauce2 from "./assets/images/sauce2.png"
import sauce3 from "./assets/images/sauce3.png"
import sauce4 from "./assets/images/sauce4.png"
import sauce5 from "./assets/images/sauce5.png"
import sauce6 from "./assets/images/sauce6.png"
import sauce7 from "./assets/images/sauce7.png"
import sauce8 from "./assets/images/sauce8.png"

import brand1 from "./assets/images/brand1.png";
import brand2 from "./assets/images/brand2.png";
import brand3 from "./assets/images/brand3.png";
import brand4 from "./assets/images/brand4.png";
import brand5 from "./assets/images/brand5.png";
import brand6 from "./assets/images/brand6.png";

import user1 from "./assets/images/user1.png"
import user2 from "./assets/images/user2.png"
import friend1 from "./assets/images/friend1.png"
import friend2 from "./assets/images/friend2.png"
import friend3 from "./assets/images/friend3.png"

import homeBanner from "./assets/images/homeBanner.png"
import reviewImage from "./assets/images/reviewImage.png"


const myurl = "https://images.unsplash.com/photo-1720357632208-63f783022899?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MTg0NjV8MHwxfGFsbHwzfHx8fHx8Mnx8MTcyMDYxMzQ4NXw&ixlib=rb-4.0.3&q=80&w=400"
export const welcomeLists = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Maecenas id metus efficitur, sollicitudin mauris in, pellentesque risus.",
    "Vivamus euismod nulla et ex tincidunt porta.",
    "Cras venenatis purus ac nisi finibus fringilla.",
    "Nunc varius sapien quis leo commodo varius.",
    "Vestibulum semper orci et ante pulvinar, vitae vulputate purus facilisis.",
    "Proin nec purus accumsan, ullamcorper nibh eget, ultricies est.",
    "Maecenas sollicitudin eros et pretium fringilla.",
    "Phasellus fermentum nisi sit amet finibus dignissim.",
]

export const handleText = (value,name, updaterFn) => {
    updaterFn(prev => ({ ...prev, [name]: value }));
  };


  export const featuredSauces = [
    {
      url: sauce1,
      title: "Red Chilli Sauce"
    },
    {
      url: sauce2,
      title: "Green Chilli Sauce"
    },
    {
      url: sauce3,
      title: "Soy Sauce"
    },
    {
      url: sauce4,
      title: "Garlic Sauce"
    }
  ];

  export const topRatedSauces = [
    {
      url: sauce5,
      title: "Barbecue Sauce"
    },
    {
      url: sauce6,
      title: "Habanero Sauce"
    },
    {
      url: sauce7,
      title: "Tomato Ketchup"
    },
    {
      url: sauce8,
      title: "Mustard Sauce"
    }
  ];

  export const Brands = [
    {
      url: brand1,
      title: "Alpha Inc."
    },
    {
      url: brand4,
      title: "Beta Technologies"
    },
    {
      url: brand6,
      title: "Gamma Solutions"
    },
    {
      url: brand2,
      title: "Delta Corp."
    },
    {
      url: brand3,
      title: "Epsilon Ltd."
    },
    {
      url: brand4,
      title: "Zeta Industries"
    },
    {
      url: brand5,
      title: "Eta Products"
    },
    {
      url: brand6,
      title: "Theta Services"
    },
    {
      url: brand2,
      title: "Iota Enterprises"
    },
    {
      url: brand3,
      title: "Kappa Co."
    }
  ];



  export const users = [
    {
      url: user1,
      title: "Mike Smith"
    },
    {
      url: user2,
      title: "john Doe"
    },

  ];


  export const messagesData = [
    {
      url: user1,
      title: "Mike Smith",
      text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
      assets:[
        sauce1,
        sauce2
      ],
      replies:[
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        },
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        },
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        },
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        }
      ]
    },
    {
      url: user1,
      title: "Mike Smith",
      text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
      assets:[
        sauce1,
        sauce2
      ],
      replies:[
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        },
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        },
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        },
        {
          url: user1,
          title: "Mike Smith",
          text:"Maecenas id metus efficitur, @William mauris in, pellentesque risus.",
        }
      ]
    },

  ];

  export const bannerImages = [
    {
      url: homeBanner,
      title: "Mike Smith"
    },
    {
      url: homeBanner,
      title: "Mike Smith"
    }
    ,
    {
      url: homeBanner,
      title: "Mike Smith"
    }
    ,
    {
      url: homeBanner,
      title: "Mike Smith"
    }
    ,
    {
      url: homeBanner,
      title: "Mike Smith"
    }
    ,
    {
      url: homeBanner,
      title: "Mike Smith"
    }
    ,
    {
      url: homeBanner,
      title: "Mike Smith"
    }
    ,
    {
      url: homeBanner,
      title: "Mike Smith"
    }

  ];
  export const reviewImages = [
    {
      url: reviewImage,
      title: "Mike Smith"
    },
    {
      url: reviewImage,
      title: "Mike Smith"
    },
    {
      url: reviewImage,
      title: "Mike Smith"
    }
    ,
    {
      url: reviewImage,
      title: "Mike Smith"
    }
    ,
    {
      url: reviewImage,
      title: "Mike Smith"
    }
    ,
    {
      url: reviewImage,
      title: "Mike Smith"
    }
    ,
    {
      url: reviewImage,
      title: "Mike Smith"
    }
    ,
    {
      url: reviewImage,
      title: "Mike Smith"
    }
  ];





  const christianNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Edward"];

export const awardListImages = Array.from({ length: 6 }, (_, index) => ({
  url: reviewImage,
  title: index === 0 ? "Mike Smith" : christianNames[index % christianNames.length],
  percentage: Math.floor(Math.random() * 91) + 10 // Random percentage between 10 to 100
}));


export const FriendListImages = [
    {
      url: friend1,
      title: "Mike Smith"
    },
    {
      url: friend2,
      title: "Mike Smith"
    },
    {
      url: friend3,
      title: "Mike Smith"
    },
    {
      url: friend1,
      title: "Mike Smith"
    },
    {
      url: friend2,
      title: "Mike Smith"
    },
    {
      url: friend3,
      title: "Mike Smith"
    },
    {
      url: friend1,
      title: "Mike Smith"
    },
    {
      url: friend2,
      title: "Mike Smith"
    },
    {
      url: friend3,
      title: "Mike Smith"
    }
  ];

  export function generateThreeDigitRandomNumber() {
    // Generate a random number between 100 and 999 inclusive
    return Math.floor(Math.random() * 900) + 100;
  }

  export function getRandomDate() {
    // Generate a random year between 2020 and 2025
    const year = Math.floor(Math.random() * (2025 - 2020 + 1)) + 2020;

    // Month names array
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

    // Generate a random month index between 0 and 11
    const monthIndex = Math.floor(Math.random() * 12);

    // Generate a random day based on the selected month (considering leap years for February)
    let maxDays = 31; // Default to maximum days in a month (for most months)
    if (monthIndex === 3 || monthIndex === 5 || monthIndex === 8 || monthIndex === 10) {
      maxDays = 30; // April, June, September, November have 30 days
    } else if (monthIndex === 1) {
      // February, consider leap year (not included in this basic example)
      maxDays = 28; // Assume non-leap year for simplicity
    }

    const day = Math.floor(Math.random() * maxDays) + 1;

    // Format day, month, and year into "MM/DD/YYYY" format with month name
    const formattedMonth = monthNames[monthIndex]; // Month name
    const formattedDay = day.toString().padStart(2, '0'); // Ensure two digits with leading zero if necessary
    const formattedYear = year.toString();

    return `${formattedMonth} ${formattedDay} ${formattedYear}`;
}


export function formatDate(date) {
  // Ensure the input is a Date object
  if (!(date instanceof Date)) {
      return 'Invalid input: Please provide a valid Date object.';
  }
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"]
  // Get the year, month, day, hours, minutes, seconds, and milliseconds
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // months are zero-indexed
  const day = date.getUTCDate().toString().padStart(2, '0');
  // Format the date and time in ISO 8601 format
  return `${monthNames[month]}-${day}-${year}`;
}


// export function formatEventDate(isoDateString, dayAndMonth) {
//   // Parse the ISO date string into a JavaScript Date object
//   const date = new Date(isoDateString);

//   // Array of days and months for formatting
//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   // Get formatted day of the week and month
//   const dayOfWeek = days[date.getUTCDay()];
//   const monthName = months[date.getUTCMonth()];

//   // Pad day, hour, and minute with leading zeros if necessary
//   const day = date.getUTCDate().toString().padStart(2, '0');
//   const hour = date.getUTCHours() % 12 || 12;  // Convert 24h to 12h format and handle '0' hour
//   const minute = date.getUTCMinutes().toString().padStart(2, '0');

//   // Determine AM or PM based on UTC hour
//   const amPm = date.getUTCHours() >= 12 ? 'PM' : 'AM';

//   // Get the year
//   const year = date.getUTCFullYear();

//   if (dayAndMonth) {
//     return `${day} ${monthName}`;
//   }

//   // Format the string as requested
//   return `${dayOfWeek}, ${monthName} ${day}, ${year} at ${hour}:${minute} ${amPm}`;
// }

export function formatEventDate(isoDateString, dayAndMonth, timeZone) {
  // Parse the ISO date string into a JavaScript Date object
  const date = new Date(isoDateString);

  // Define formatting options based on the requirement
  const options = dayAndMonth
    ? { day: '2-digit', month: 'long', timeZone }
    : {
        weekday: 'short',
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone,
      };

  // Create an Intl.DateTimeFormat formatter
  const formatter = new Intl.DateTimeFormat('en-US', options);

  // Format the date
  return formatter.format(date);
}



// Example usage:
const exampleDate = new Date('August 14, 2024 21:45:36.776');
export const GetPLatformSpecificURL = (platform, uri)=>{
  return platform.os =="ios"? uri:'file://'+uri
}


  export function generateRandomText(num=400) {
    const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];
    const length = Math.floor(Math.random() * num);
    let text = "";
    while (text.length < length) {
      text += words[Math.floor(Math.random() * words.length)] + " ";
    }
    return text.trim();
  }



  export const getFormattedName=(name)=>{
    name = name?.split(" ")
    if (name?.length>1){
    name = name[0]?.slice(0,1)?.toUpperCase() + name[0]?.slice(1) + " " + name[1]?.slice(0,1)?.toUpperCase() + "."
    }
    else{
      name=name?.join("")
    }

    return name
}

export const isURL = (url)=>{
  const re = new RegExp(
    /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-F\d]{2})+(:([\d\w]|%[a-fA-F\d]{2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-F\d]{2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-F\d]{2})=?)*)?(#([-+_~.\d\w]|%[a-fA-F\d]{2})*)?$/i
  );
    return re.test(url)
}

export const welcomepoints= [
  "- Real reviews (for sauces you love and for sauces you're thinking about trying)",
  "- Sharing your latest experience with a new hot sauce",
  "- Easily finding any hot sauces you want along with all of the details and where to find/purchase it",
  "- Tracking/collecting every hot sauce you've tried and want to try",
  "- Stay up to date with the latest hot sauce events",
  "- Total bragging rights (every time you leave a review or post, you're awarded points and move up a tier)",
  "- Users can display earned badges on their profiles to showcase their expertise and dedication within the hot sauce community. Users are awarded 1 point every time they post a review 2 points if they include an image. "
]

export const isDate = function(date) {
  return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


export const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



export const firebaseAuthErrorMessages = {
  'auth/invalid-email': 'The email address you entered is invalid. Please check and try again.',
  'auth/user-disabled': 'Your account has been disabled. Please contact support for assistance.',
  'auth/user-not-found': 'No account found with this email. Please sign up first.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'This email is already associated with another account.',
  'auth/weak-password': 'Your password is too weak. Please use at least 6 characters.',
  'auth/too-many-requests': 'Too many unsuccessful attempts. Please try again later.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  // Exclude popup-related messages for cancellation
  // 'auth/popup-closed-by-user': 'The sign-in popup was closed before completing the sign-in.',
  // 'auth/cancelled-popup-request': 'Popup request was cancelled. Please try again.',
  // Add more mappings as needed
};

export  const getFriendlyErrorMessage = (error) => {
  if (error && error.code) {
    // Skip showing any message for cancellation-related errors
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return null; // Do not return any message
    }
    return firebaseAuthErrorMessages[error.code] ;
  }
  return '';
};

