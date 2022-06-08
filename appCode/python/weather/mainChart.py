import urllib.request as urllib2
import math
import re
from bs4 import BeautifulSoup
from datetime import datetime

global season
season = ''
# Stores the current day that we are working on (99=not calculated yet)
global currentDayGlb 
currentDayGlb = 99
global textDayGlb 
textDayGlb = ''

TABULAR_PAGE= 'https://forecast.weather.gov/MapClick.php?lat=42.9569&lon=-78.8328&unit=0&lg=english&FcstType=digital'
TABULAR_PAGE_2_SUFFIX = '&AheadHour=48'
TABULAR_PAGE_3_SUFFIX = '&AheadHour=96'

HAZARDS_PAGE = "https://forecast.weather.gov/showsigwx.php?warnzone=NYZ010&warncounty=NYC029&firewxzone=NYZ010&local_place1=2%20Miles%20ESE%20Kenmore%20NY&product1=Hazardous+Weather+Outlook&lat=42.9569&lon=-78.8328#.Xzk52RkpBuQ"

DEBUG_GET = 0 
DEBUG_CALC = 0


def estimateSunTimes ():

    global SunRiseTime
    global SunSetTime
    global SunAltFraction

    currentMonth = datetime.now().month
     
    if (currentMonth == 1):
        SunSetTime = 17
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(26.2)) 
    if (currentMonth == 2):
        SunSetTime = 18
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(34.7)) 
    if (currentMonth == 3):
        SunSetTime = 19
        SunRiseTime = 7
        SunAltFraction = math.sin(math.radians(45.3)) 
    if (currentMonth == 4):
        SunSetTime = 20
        SunRiseTime = 7
        SunAltFraction = math.sin(math.radians(57.1)) 
    if (currentMonth == 5):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(66.2)) 
    if (currentMonth == 6):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(70.5)) 
    if (currentMonth == 7):
        SunSetTime = 21
        SunRiseTime = 6
        SunAltFraction = math.sin(math.radians(68.5)) 
    if (currentMonth == 8):
       SunSetTime = 21
       SunRiseTime = 6
       SunAltFraction = math.sin(math.radians(60.9)) 
    if (currentMonth == 9):
        SunSetTime = 20
        SunRiseTime = 7
        SunAltFraction = math.sin(math.radians(49.9)) 
    if (currentMonth == 10):
        SunSetTime = 19
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(38.4)) 
    if (currentMonth == 11):
        SunSetTime = 18
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(28.5)) 
    if (currentMonth == 12):
        SunSetTime = 17
        SunRiseTime = 8
        SunAltFraction = math.sin(math.radians(23.8)) 


def ifTextGetDataFor (tabular, rowToGet, textToGet, i, rowTitleIsBold):
    if (rowTitleIsBold):
      	 
        if (tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[0].font.b.get_text() == textToGet):
            return tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[i].font.b.get_text()
    elif (tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[0].font.get_text() == textToGet):
        return tabular.find_all('table')[7].find_all('tr')[2+rowToGet].find_all('td')[i].font.b.get_text()
    else:
        return "--"


def resetRowToGet (webpageRowNum, season):
    
    # Each NWS webpage has two "grids", each 24 hours of info. If we are looking at
    # the first row, the table row in BeautifulSoup is '0', if it's the second row, 
    # then the day starts at '17'.
    if (webpageRowNum == 1):
        BSrowToGet = 0
        if (DEBUG_GET):
            print ("<br>BSrowToGet: " + str(BSrowToGet))
        return BSrowToGet
    else:
        if (season == 'Winter'):
            BSrowToGet = 17
        else:
            BSrowToGet = 14
        if (DEBUG_GET):
            print ("<br>BSrowToGet: " + str(BSrowToGet))
        return BSrowToGet


def readWeatherRows (webpageRowNum, tabular, season):

    if (DEBUG_GET):
        print ('<br>----------------------------------------------------------------')
        print ("<br>webpageRowNum: " + str(webpageRowNum))
 
    BSrowToGet = resetRowToGet (webpageRowNum, season)

    # For each column in the table, populate the DB. Note, 'i' is each datapoint representing an hour.
    for i in range (1,25,1):
        
        db_Hour[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Hour (EST)', i, 1)
        db_Hour[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Hour (EDT)', i, 1)
        if (db_Hour[i] == ""):
            print ("<br>ERROR: Could not read hour row!")

        if (DEBUG_GET):
            print ("<br>The hour is: " + db_Hour[i])
        
        BSrowToGet = BSrowToGet + 1
        db_Temperature[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Temperature (°F)', i, 0)
        if (db_Temperature[i] == ""):
            print ("<br>ERROR: Could not read temp row!")

        if (DEBUG_GET):
            print ("<br>The temp is: " + db_Temperature[i])

        BSrowToGet = BSrowToGet + 1
        db_Dewpoint[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Dewpoint (°F)', i, 0)
        if (db_Dewpoint[i] == ""):
            print ("<br>ERROR: Could not read dewpoint row!")

        if (DEBUG_GET):
            print ("<br>The dewpoint is: " + db_Dewpoint[i])
       
        BSrowToGet = BSrowToGet + 1
        db_WindChill[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Wind Chill (°F)', i, 0)
        db_HeatIndex[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Heat Index (°F)', i, 0)
        if (db_WindChill[i] == "" and db_HeatIndex[i] == ""):
            print ("<br>ERROR: Could not read WindChill/HeatIndex row!")

        if (DEBUG_GET):
            if(db_WindChill[i]):
                print ("<br>The windchill is: " + db_WindChill[i])
            elif(db_HeatIndex[i]):
                print ("<br>The heat index is: " + db_HeatIndex[i])

        BSrowToGet = BSrowToGet + 1
        db_SurfaceWind[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Surface Wind (mph)', i, 0)
        if (db_SurfaceWind[i] == ""):
            print ("<br>ERROR: Could not read wind row!")

        if (DEBUG_GET):
            print ("<br>The wind is: " + db_SurfaceWind[i])
        
        BSrowToGet = BSrowToGet + 1
        db_WindDir[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Wind Dir', i, 0)
        if (db_WindDir[i] == ""):
            print ("<br>ERROR: Could not read direction row!")

        if (DEBUG_GET):
            print ("<br>The direction is: " + db_WindDir[i])
        
        # Note, if there are no gusts, this row on the webpage is left blank,
        # therefore a missing value is not an error.
        BSrowToGet = BSrowToGet + 1
        db_Gust[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Gust', i, 0)

        if (DEBUG_GET):
            print ("<br>The gust is: " + db_Gust[i])
        
        BSrowToGet = BSrowToGet + 1
        db_SkyCover[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Sky Cover (%)', i, 0)
        if (db_SkyCover[i] == ""):
            print ("<br>ERROR: Could not read sky row!")

        if (DEBUG_GET):
            print ("<br>The sky is: " + db_SkyCover[i])
        
        BSrowToGet = BSrowToGet + 1
        db_PrecipitationPotential[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Precipitation Potential (%)', i, 0)
        if (db_PrecipitationPotential[i] == ""):
            print ("<br>ERROR: Could not read POP row!")

        if (DEBUG_GET):
            print ("<br>The POP is: " + db_PrecipitationPotential[i])
        
        BSrowToGet = BSrowToGet + 1
        db_RelativeHumidity[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Relative Humidity (%)', i, 0)
        if (db_RelativeHumidity[i] == ""):
            print ("<br>ERROR: Could not read humidity row!")

        if (DEBUG_GET):
            print ("<br>The humidity is: " + db_RelativeHumidity[i])
        
        BSrowToGet = BSrowToGet + 1
        db_Rain[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Rain', i, 0)
        if (db_Rain[i] == ""):
            print ("<br>ERROR: Could not read rain row!")

        if (DEBUG_GET):
            print ("<br>The rain is: " + db_Rain[i])
        
        BSrowToGet = BSrowToGet + 1
        db_Thunder[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Thunder', i, 0)
        if (db_Thunder[i] == ""):
            print ("<br>ERROR: Could not read thunder row!")

        if (DEBUG_GET):
            print ("<br>The thunder is: " + db_Thunder[i])
        
        # If there are additional rows, that indicates that the grid is in "winter" mode
        # with frozen precip options
#        if (len(tabular.find_all('table')[7].find_all('tr')) > 14+BSrowToGet):
        if (len(tabular.find_all('table')[7].find_all('tr')) > 28):
            season = 'Winter'
            if (tabular.find_all('table')[7].find_all('tr')[14+BSrowToGet].find_all('td')[0].font):
                BSrowToGet = BSrowToGet + 1
                db_Snow[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Snow', i, 0)
                if (db_Snow[i] == ""):
                    print ("<br>ERROR: Could not read Snow row!")

                if (DEBUG_GET):
                    print ("<br>The snow is: " + db_Snow[i])
        
            BSrowToGet = BSrowToGet + 1
            db_FreezingRain[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Freezing Rain', i, 0)
            if (db_FreezingRain[i] == ""):
                print ("<br>ERROR: Could not read freezing rain row!")

            if (DEBUG_GET):
                print ("<br>The freezing rain is: " + db_FreezingRain[i])
        
            BSrowToGet = BSrowToGet + 1
            db_Sleet[i] = ifTextGetDataFor (tabular, BSrowToGet, 'Sleet', i, 0)
            if (db_Sleet[i] == ""):
                print ("<br>ERROR: Could not read sleet row!")

            if (DEBUG_GET):
                print ("<br>The sleet is: " + db_Sleet[i])
        else:
            season = 'Summer'

        BSrowToGet = resetRowToGet (webpageRowNum, season)
    
        if (db_HeatIndex[i] == ''):
            db_HeatIndex[i] = '--'

        if (db_WindChill[i] == ''):
            db_WindChill[i] = '--'

        if (db_Gust[i] == '') :
            db_Gust[i] = '--'

def whatDayIsIt(day):
    
    # Everytime we start this function, we are gathering data for a new day.
    currentDay = currentDayGlb 
    
    if (DEBUG_GET):
        print ("<br>currentDay: " + str(currentDay))
    
    if (currentDay == 0):
        textDayGlb = "Monday"
    elif (currentDay == 1):
        textDayGlb = "Tuesday"
    elif (currentDay == 2):
        textDayGlb = "Wednesday"
    elif (currentDay == 3):
        textDayGlb = "Thursday"
    elif (currentDay == 4):
        textDayGlb = "Friday"
    elif (currentDay == 5):
        textDayGlb = "Saturday"
    elif (currentDay == 6):
        textDayGlb = "Sunday"

    if (DEBUG_GET):
        print("<br>textDayGlb: " + str(textDayGlb))

    return textDayGlb

def calcSunPosition (i):

    if (int(db_Hour[i]) >= SunRiseTime and int(db_Hour[i]) < SunSetTime):
        db_SunTimeFraction[i] = math.sin(math.radians((1- ((abs(((SunSetTime + SunRiseTime)/2) - int(db_Hour[i])))/((SunSetTime - SunRiseTime)/2)))*90))
        
    if (int(db_Hour[i]) >= SunRiseTime and int(db_Hour[i]) < SunSetTime):
        db_SunCloudFraction[i] = math.sin(math.radians(((100-int(db_SkyCover[i]))/100)*90))


def calculateApparentTemp(i):
        
    db_ApparentTemp[i] = float(db_Temperature[i])
    if (DEBUG_CALC):
        print("<br>ApparentTemp #1: Start with air temp: " + str(db_ApparentTemp[i]))

    db_ShadeTemp[i] = db_Temperature[i]
    if (DEBUG_CALC):
        print("<br>ShadeTemp #1: Start with air temp: " + str(db_ShadeTemp[i]))
    
    if(db_HeatIndex[i] != '--' and int(db_HeatIndex[i]) >= 74):
        
        db_ApparentTemp[i] = db_HeatIndex[i]
        if (DEBUG_CALC):
            print("<br>ApparentTemp #2: HI is populated and >=74, use HI: " + str(db_ApparentTemp[i]))
        
        db_ShadeTemp[i] = db_HeatIndex[i]
        if (DEBUG_CALC):
            print("<br>ShadeTemp #2: HI is populated and >=74, use HI: " + str(db_ShadeTemp[i]))
    
    elif(db_WindChill[i] != '--' and int(db_WindChill[i]) <= 50):
        
        db_ApparentTemp[i] = db_WindChill[i]
        if (DEBUG_CALC):
            print("<br>ApparentTemp #2: WC is populated and <=50, use WC: " + str(db_ApparentTemp[i]))
        
        db_ShadeTemp[i] = db_WindChill[i]
        if (DEBUG_CALC):
            print("<br>ShadeTemp #2: WC is populated and <=50, use WC: " + str(db_ShadeTemp[i]))
            
    else:
        
        if (DEBUG_CALC):
            print("<br>ApparentTemp #2: No WC and no HI, no modifier: " + str(db_ApparentTemp[i]))
            print("<br>ShadeTemp #2: No WC and no HI, no modifier: " + str(db_ShadeTemp[i]))
        
    if(int(db_Dewpoint[i]) > 55):
        
        db_ApparentTemp[i] = int(db_ApparentTemp[i]) + ((int(db_Dewpoint[i])-55)/2)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #3: Dewpoint is >55, add 1 degree for each 2 above 55: " + str(db_ApparentTemp[i]))
        
        db_ShadeTemp[i] = int(db_ShadeTemp[i]) + ((int(db_Dewpoint[i])-55)/2)
        if (DEBUG_CALC):
            print("<br>ShadeTemp #3: Dewpoint is >55, add 1 degree for each 2 above 55: " + str(db_ShadeTemp[i]))
    
    else:
        
        if (DEBUG_CALC):
            print("<br>ApparentTemp #3: Dewpoint is <=55, no modifier: " + str(db_ApparentTemp[i]))
            print("<br>ShadeTemp #3: Dewpoint is <=55, no modifier: " + str(db_ShadeTemp[i]))
    
    if (int(db_Temperature[i]) > 50 and int(db_SurfaceWind[i]) > 5):
        
        db_ApparentTemp[i] = int(db_ApparentTemp[i]) - ((int(db_SurfaceWind[i]) - 5)/3)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #4: Above temp of 50, wind is >5. Subtract one degree for each 3 mph above 5: " 
                    + str(db_ApparentTemp[i]))
    
    else:
        
        if (DEBUG_CALC):
            print("<br>ApparentTemp #4: Temp < 50 or wind <5. No modifier: " 
                    + str(db_ApparentTemp[i]))

    
    if (int(db_Hour[i]) >= SunRiseTime and int(db_Hour[i]) < SunSetTime ):
        
        db_ApparentTemp[i] = int(db_ApparentTemp[i]) + (15 * db_SunCloudFraction[i] * db_SunTimeFraction[i] * SunAltFraction) 
        if (DEBUG_CALC):
            print("<br>ApparentTemp #5: It is daytime, add up to 15 degrees for sun strength based on clouds, time, and altitude: " 
                + str(db_ApparentTemp[i]))
    
    else:
        
        if (DEBUG_CALC):
            print("<br>ApparentTemp #5: Nighttime, no sun modifier: " 
                + str(db_ApparentTemp[i]))

    if (int(db_SkyCover[i]) > 70 and int(db_PrecipitationPotential[i]) > 50):
        
        db_ApparentTemp[i] = int(db_ApparentTemp[i]) - ((int(db_PrecipitationPotential[i])-50)/10)
        if (DEBUG_CALC):
            print("<br>ApparentTemp #6: If mostly cloudy and POPs >50, then subtract 1 degree for every 10 POPs over 50: " 
                + str(db_ApparentTemp[i]))
    
    else:
        
        if (DEBUG_CALC):
            print("<br>ApparentTemp #6: Not cloudy or not likely POPs, no modifier: " 
                + str(db_ApparentTemp[i]))

    db_ApparentTemp[i] = int(round(float (db_ApparentTemp[i])))
    if (DEBUG_CALC):
        print("<br>ApparentTemp Final: Rounding to nearest whole number: " 
            + str(db_ApparentTemp[i]))

    db_ShadeTemp[i] = int(round(float (db_ShadeTemp[i])))
    if (DEBUG_CALC):
        print("<br>ShadeTemp Final: Rounding to nearest whole number: " 
            + str(db_ShadeTemp[i]))


def create_page_header ():
    print ("<HTML> <link rel='stylesheet' href='style.css'> <BODY> ")


def create_page_table_head ():
    print ("<TABLE border=1> <THEAD> <TH> Time </TH>" 
        "<TH> Temp </TH> <TH> DewPoint </TH> " 
        "<TH> Wind </TH> <TH> db_Gusts </TH>"  
        "<TH> PrecipDescr </TH> <TH> ThunderDescr </TH> <TH> db_ApparentTemp </TH>" 
        "<TH> db_OutsideSedentary</TH><TH>Bike</th>" 
        "<TH>Run Easy</TH><TH>Run Hard</TH></THEAD>")


def link_tag (url, text):
    print ("<a href='" + url + "'>" + text + "</a>")


def new_day (day):
    print ("</tr><thead><th colspan=12>"+ str(day)+"</th></thead>")
    create_page_table_head()


def new_row ():
    print("</tr><tr>")


def print_cell (theValue, theColor):
    print("<td bgcolor='"+theColor+"'><center>"+str(theValue)+"</center></td>")


def print_temp_dewpoint (i):
    if (int(db_Temperature[i]) >= 60 
            and int(db_Temperature[i]) < 78 
            and int(db_Dewpoint[i]) < 60 
            and (db_HeatIndex[i] == '--' 
                or int(db_HeatIndex[i]) < 78) 
            and int(db_Hour[i]) >= 8 
            and int(db_Hour[i]) < 21) :
        
        print_cell (db_Temperature[i], "white")
        print_cell (db_Dewpoint[i], "white")

    elif (int(db_Temperature[i]) >= 47 
            and int(db_Temperature[i]) < 60 
            and int(db_Dewpoint[i]) < 60 
            and (int(db_Hour[i]) < 8 
                or int(db_Hour[i]) >= 21)) :
            
        print_cell (db_Temperature[i], "white")
        print_cell (db_Dewpoint[i], "white")
    
    elif (int(db_Temperature[i]) >=78 
            or (db_HeatIndex[i] != '--' 
                and int(db_HeatIndex[i]) >= 78) 
            or int(db_Dewpoint[i]) >= 60):
        
        print_cell (db_Temperature[i], "white")
        print_cell (db_Dewpoint[i], "white")
        
    elif ((int(db_Temperature[i]) >=60 
        or int(db_Dewpoint[i]) >= 60) 
        and (int(db_Hour[i]) < 8 
            or int(db_Hour[i]) >=21)): 
        print_cell (db_Temperature[i], "white")
        print_cell (db_Dewpoint[i],"white")
    
    else:
        print_cell (db_Temperature[i], "white")
        print_cell (db_Dewpoint[i], "white")
            
def print_wind(i):
    if (int(db_SurfaceWind[i]) >= 44 
            or (db_Gust[i] != '--' 
                and int(db_Gust[i]) >= 55)) :
        print_cell (db_SurfaceWind[i], "red")
        print_cell (db_Gust[i], "red")
        
    elif (int(db_SurfaceWind[i]) >= 31 
            or (db_Gust[i] != '--' 
                and int(db_Gust[i]) >= 39)) :
        print_cell (db_SurfaceWind[i], "orange")
        print_cell (db_Gust[i], "orange")
        
    elif (int(db_SurfaceWind[i]) >= 20 
            or (db_Gust[i] != '--' 
                and int(db_Gust[i]) >= 25)) :
        print_cell (db_SurfaceWind[i], "yellow")
        print_cell (db_Gust[i], "yellow")
        
    else :
        print_cell (db_SurfaceWind[i], "white")
        print_cell (db_Gust[i], "white")


def print_precip(i):
    if (db_FreezingRain[i] == 'Ocnl') :
        print_cell (db_FreezingRain[i], "darkmagenta")
           
    elif (db_Sleet[i] == 'Ocnl') :
        print_cell (db_Sleet[i], "darkmagenta")

    elif (db_Snow[i] == 'Ocnl') :
        print_cell (db_Snow[i], "deepskyblue")
        
    elif (db_Rain[i] == 'Ocnl') :
        print_cell (db_Rain[i], "darkslategray")
        
    elif (db_FreezingRain[i] == 'Lkly') :
        print_cell (db_FreezingRain[i], "magenta")
            
    elif (db_Sleet[i] == 'Lkly') :
        print_cell (db_Sleet[i], "magenta")
        
    elif (db_Snow[i] == 'Lkly') :
        print_cell (db_Snow[i], "lightskyblue")
    
    elif (db_Rain[i] == 'Lkly') :
        print_cell (db_Rain[i], "gray")
        
    elif (db_FreezingRain[i] == 'Chc') :
        print_cell (db_FreezingRain[i], "thistle")
           
    elif (db_Sleet[i] == 'Chc') :
        print_cell (db_Sleet[i], "thistle")
        
    elif (db_Snow[i] == 'Chc') :
        print_cell (db_Snow[i], "lightcyan")
        
    elif (db_Rain[i] == 'Chc') :
        print_cell (db_Rain[i], "lightgray")
        
    elif (db_FreezingRain[i] == 'SChc') :
        print_cell (db_FreezingRain[i], "white")
            
    elif (db_Sleet[i] == 'SChc') :
        print_cell (db_Sleet[i], "white")
    
    elif (db_Snow[i] == 'SChc') :
        print_cell (db_Snow[i], "white")
        
    elif (db_Rain[i] == 'SChc') :
        print_cell (db_Rain[i], "white")
        
    else:
        print_cell (db_Rain[i], "white")

def print_thunder(i):
    if (db_Thunder[i] == 'SChc') :
        print_cell (db_Thunder[i], "thistle")
            
    elif (db_Thunder[i] == 'Chc') :
        print_cell (db_Thunder[i], "violet")
      
    elif (db_Thunder[i] == 'Lkly') :
        print_cell (db_Thunder[i], "magenta")
      
    elif (db_Thunder[i] == 'Ocnl') :
        print_cell (db_Thunder[i], "purple")
        
    else:
        print_cell (db_Thunder[i], "white")
            

def print_sedentary(i):
    # Outside Sedentary
    if (int(db_ApparentTemp[i]) >= 74):
        print_cell ("T-Shirt and <br> Shorts", "white")
    elif(int(db_ApparentTemp[i]) >= 69):
        print_cell ("Long-Sleeve and <br> Shorts", "white")
    elif(int(db_ApparentTemp[i]) >= 64):
        print_cell ("Long-Sleeve and <br> Pants", "white")
    elif(int(db_ApparentTemp[i]) >= 59):
        print_cell ("Long-Sleeve and <br> Pants with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 54):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Pants with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 49):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Pants with <br> Light Gloves and <br> Light Cap", "white")
    elif(int(db_ApparentTemp[i]) >= 44):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Pants with <br> Light Gloves and <br> Light Cap", "white")
    elif(int(db_ApparentTemp[i]) >= 39):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Pants with <br> Light Gloves and <br> Light Cap", "white")
    elif(int(db_ApparentTemp[i]) >= 34):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Pants with <br> Moderate Gloves and <br> Light Cap", "white")
    elif(int(db_ApparentTemp[i]) >= 29):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Pants with <br> Moderate Gloves and <br> Light Cap", "white")
    elif(int(db_ApparentTemp[i]) >= 24):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Pants with <br> Moderate Gloves and <br> Heavy Cap and <br> Boots", "white")
    elif(int(db_ApparentTemp[i]) >= 19):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Heavy Pants with <br> Moderate Gloves and <br> Heavy Cap and <br> Boots", "white")
    elif(int(db_ApparentTemp[i]) >= 14):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Heavy Pants with <br> Heavy Mittens and <br> Heavy Cap and <br> Boots and <br> Double Socks and <br> Face Covering", "white")
    elif(int(db_ApparentTemp[i]) >= 9):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Heavy Pants with <br> Heavy Mittens and <br> Heavy Cap and <br> Boots and <br> Double Socks and <br> Face Covering" , "white")
    else: #(int(db_ApparentTemp[i]) >= 4):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Heavy Pants and <br> db_Snow-Pants with <br> Heavy Mittens and Liners and <br> Heavy Cap and <br> Boots and <br> Double Socks and <br> Face Covering", "white")


def print_bike(I):

    # Bike
    if (int(db_ApparentTemp[i]) >= 64):
        print_cell ("T-Shirt and <br> Shorts", "white")
    elif(int(db_ApparentTemp[i]) >= 59):
        print_cell ("Long-Sleeve and <br> Shorts", "white")
    elif(int(db_ApparentTemp[i]) >= 54):
        print_cell ("Long-Sleeve and <br> Light Tights with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 49):
        print_cell ("Long-Sleeve and <br> Light Tights with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 44):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves and <br> Skull Cap", "white")
    elif(int(db_ApparentTemp[i]) >= 39):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves and <br> Skull Cap" , "white")
    elif(int(db_ApparentTemp[i]) >= 34):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Light Tights with <br> Moderate Gloves and <br> Skull Cap" , "white")
    elif(int(db_ApparentTemp[i]) >= 29):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Ski Helmet", "white")
    elif(int(db_ApparentTemp[i]) >= 24):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Ski Helmet and <br> Shoe Coverings", "white")
    elif(int(db_ApparentTemp[i]) >= 19):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Heavy Mittens and <br> Ski Helmet and <br> Shoe Coverings", "white")
    elif(int(db_ApparentTemp[i]) >= 14):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Heavy Mittens and <br> Ski Helmet with <br> Skull Cap and <br> Goggles and <br> Shoe Coverings with <br> Double Socks", "white")
    elif(int(db_ApparentTemp[i]) >= 9):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Heavy Mittens and <br> Ski Helmet with <br> Skull Cap and <br> Goggles and <br> Shoe Coverings with <br> Double Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= 4):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Heavy Mittens with Liners and <br> Ski Helmet with <br> Skull Cap and <br> Goggles and <br> Face Covering and <br> Shoe Coverings with <br> Double Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= -1):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights and <br> db_Snow-Pants with <br> Heavy Mittens with Liners and <br> Ski Helmet with <br> Skull Cap and <br> Goggles and <br> Face Covering and <br> Shoe Coverings with <br> Double Socks" , "white")
    else: #(int(db_ApparentTemp[i]) >= -6):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights and <br> db_Snow-Pants with <br> Heavy Mittens with Liners and <br> Ski Helmet with <br> Skull Cap and <br> Goggles and <br> Face Covering and <br> Shoe Coverings with <br> Double Socks", "white")


def print_run_easy(i):
    # Run Easy 
    if (int(db_ApparentTemp[i]) >= 54):
        print_cell ("T-Shirt and <br> Shorts",  "white")
    elif(int(db_ApparentTemp[i]) >= 49):
        print_cell ("Long-Sleeve and <br> Shorts", "white")
    elif(int(db_ApparentTemp[i]) >= 44):
        print_cell ("Long-Sleeve and <br> Light Tights", "white")
    elif(int(db_ApparentTemp[i]) >= 39):
        print_cell ("Long-Sleeve and <br> Light Tights with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 34):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 29):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves and <br> Light Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= 24):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves and <br> Light Cap and <br> Heavy Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= 19):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Light Gloves and <br> Light Cap and <br> Heavy Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= 14):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Light Cap and <br> Heavy Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= 9):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Light Cap and <br> Heavy Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= 4):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Heavy Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= -1):
        print_cell (db_ApparentTemp[i], "white")
    elif(int(db_ApparentTemp[i]) >= -6):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Heavy Mittens and <br> Heavy Cap and <br> Face Covering and <br> Heavy Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= -11):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Heavy Mittens and <br> Heavy Cap and <br> Face Covering and <br> Heavy Socks", "white")
    else: #(int(db_ApparentTemp[i]) >= -16):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights and <br> db_Snow-Pants with <br> Heavy Mittens and <br> Heavy Cap and <br> Face Covering and <br> Heavy Socks", "white")


def print_run_hard(i):
    # Run  Hard
    if (int(db_ApparentTemp[i]) >= 49):
        print_cell ("T-Shirt and <br> Shorts" , "white")
    elif(int(db_ApparentTemp[i]) >= 44):
        print_cell ("Long-Sleeve and <br> Shorts", "white")
    elif(int(db_ApparentTemp[i]) >= 39):
        print_cell ("Long-Sleeve and <br> Light Tights", "white")
    elif(int(db_ApparentTemp[i]) >= 34):
        print_cell ("Long-Sleeve and <br> Light Tights with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 29):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves", "white")
    elif(int(db_ApparentTemp[i]) >= 24):
        print_cell ("Medium Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves and <br> Light Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= 19):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Light Tights with <br> Light Gloves and <br> Light Cap and <br> Heavy Socks" , "white")
    elif(int(db_ApparentTemp[i]) >= 14):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Light Gloves and <br> Light Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= 9):
        print_cell ("Heavy Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Light Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= 4):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Light Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= -1):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Heavy Tights with <br> Moderate Gloves and <br> Heavy Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= -6):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Moderate Gloves and <br> Heavy Cap and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= -11):
        print_cell ("Heavy Top and <br> Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Heavy Mittens and <br> Heavy Cap and <br> Face Covering and <br> Heavy Socks", "white")
    elif(int(db_ApparentTemp[i]) >= -16):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights with <br> Heavy Mittens and <br> Heavy Cap and <br> Face Covering and <br> Heavy Socks" , "white")
    else: #(int(db_ApparentTemp[i]) >= -21):
        print_cell ("Heavy Top and <br> Double-Layer Moderate Top and <br> Long-Sleeve and <br> Double-layer Tights and <br> db_Snow-Pants with <br> Heavy Mittens and <br> Heavy Cap and <br> Face Covering and <br> Heavy Socks", "white")
    
def print_row (i, day):
    if (db_Hour[i] == "00"):
        new_day(day)   
         
    new_row()
    print_cell (db_Hour[i], "white")

    print_temp_dewpoint (i)

    print_wind(i) 
       
    print_precip(i)    
    
    print_thunder(i)

    print_cell (db_ApparentTemp[i], "white")

    print_sedentary(i)            

    print_bike(i)

    print_run_easy(i)

    print_run_hard(i)

#    TempCelcius = (5 / 9) * (int(Temperature[i]) - 32) 
#    TempKelvin = (TempCelcius + 273)
#    DewCelcius = (5 / 9) * (int(Dewpoint[i]) - 32)

#    ES = (6.11 * (10 ** (7.5 * TempCelcius / (237.7 + TempCelcius))))
#    E = (6.11 * (10 ** (7.5 * DewCelcius / ( 237.7 + DewCelcius))))
#    Humidity = ((E / ES) *100)
#    ETS = (10 ** (( -2937.4 / TempKelvin ) - 4.9283 * math.log(TempKelvin) / 2.302 + 23.5471))
#    ETD = (ETS * Humidity / 100)

#    HICelcius = (TempCelcius + ((ETD - 10) * 5 / 9))
#    db_HeatIndex = (HICelcius * (9/5) +32)
#    WindKPH = (int(SurfaceWind[i]) * 1.61) 
#    WCCelcius = (13.12 + (0.6215 * TempCelcius) - (11.37 * (WindKPH ** 0.16)) + (0.3965 * TempCelcius * (WindKPH ** 0.16)))

 #   if (WindKPH >= 4):
 #       db_WindChill = ((WCCelcius * (9/5)) + 32)
 #   else: 
 #       db_WindChill = ((TempCelcius * (9/5)) + 32)
#
 #   WCDiff = ((5/9) * (WindChill-32)) - TempCelcius
 #   HIandWC = (WCDiff + HICelcius)

  #  SunAlt = (sun.find(id='sunalt').get_text())
  #  SunAngle = float(re.sub("[^\d.]+", "", SunAlt))
  #  SunPct = math.sin(math.radians(SunAngle))  

   # Precip = (int(PrecipitationPotential[i]) /100)
   # PrecipLoss = Precip * (int(Temperature[i]) - int(Dewpoint[i]))
   # SunDiffuse = 1 - (int(SkyCover[i]) /100) 
    
   # AppTemp = HIandWC + ((SunDiffuse * (SunPct* 20)) - PrecipLoss)
   # AppTemp = AppTemp *(9/5) + 32
    
   # print ("<TD> " + str(AppTemp) + "</TD></TR>")
    

#print ("</TABLE>")

#Read in urls and parse HTML
tabular_source = urllib2.urlopen(TABULAR_PAGE)
tabular_source_2 = urllib2.urlopen(TABULAR_PAGE + TABULAR_PAGE_2_SUFFIX)
tabular_source_3 = urllib2.urlopen(TABULAR_PAGE + TABULAR_PAGE_3_SUFFIX)
#sun_source = urllib2.urlopen(SUN_PAGE)
tabular = BeautifulSoup(tabular_source, 'html.parser')
tabular_2 = BeautifulSoup(tabular_source_2, 'html.parser')
tabular_3 = BeautifulSoup(tabular_source_3, 'html.parser')
#sun = BeautifulSoup (sun_source, 'html.parser')

SunRiseTime = 0
SunSetTime = 0
SunAltFraction = 0

# Create local DB to store values
db_Hour = [""]*25
db_Temperature = [""]*25 
db_Dewpoint = [""]*25
db_HeatIndex = [""]*25
db_WindChill = [""]*25
db_SurfaceWind = [""]*25
db_WindDir = [""]*25
db_Gust = [""]*25
db_SkyCover = [""]*25
db_PrecipitationPotential = [""]*25 
db_RelativeHumidity = [""]*25
db_Rain = [""]*25
db_Thunder = [""]*25
db_Snow = [""]*25
db_FreezingRain = [""]*25
db_Sleet = [""]*25
db_ApparentTemp = [""]*25
db_ShadeTemp = [""]*25
db_OutsideSedentary = [""]*25
db_OutsideMoving = [""]*25
db_RunEasy = [""]*25
db_RunHard = [""]*25
db_BikeEasy = [""]*25
db_BikeHard = [""]*25
db_SunTimeFraction = [0]*25
db_SunCloudFraction = [0]*25

database = (
    db_Hour 
    ,db_Temperature  
    ,db_Dewpoint 
    ,db_HeatIndex 
    ,db_WindChill 
    ,db_SurfaceWind 
    ,db_WindDir 
    ,db_Gust 
    ,db_SkyCover 
    ,db_PrecipitationPotential  
    ,db_RelativeHumidity 
    ,db_Rain 
    ,db_Thunder 
    ,db_Snow 
    ,db_FreezingRain 
    ,db_Sleet 
    ,db_ApparentTemp 
    ,db_ShadeTemp 
    ,db_OutsideSedentary 
    ,db_OutsideMoving 
    ,db_RunEasy 
    ,db_RunHard 
    ,db_BikeEasy 
    ,db_BikeHard 
    ,db_SunTimeFraction 
    ,db_SunCloudFraction 
)


estimateSunTimes ()
create_page_header ()
link_tag (HAZARDS_PAGE, "Click here for active statements!")
create_page_table_head()

tempDayToPrint = ''

if (currentDayGlb == 99):
   
    if (datetime.now().weekday() == 6):
        currentDayGlb = 0
    else:
        currentDayGlb = datetime.now().weekday() +1

elif (currentDayGlb == 6):
    currentDayGlb = 0

else:
    currentDayGlb = currentDayGlb +1

tempDayToPrint = whatDayIsIt (currentDayGlb)

readWeatherRows (1,tabular, season)

for i in range (1,25,1):

    calcSunPosition(i)    
    calculateApparentTemp (i)

for i in range (1,25,1):
    print_row(i, tempDayToPrint)

if (currentDayGlb == 99):

    if (datetime.now().weekday() == 6):
        currentDayGlb = 0
    else:
        currentDayGlb = datetime.now().weekday()+1

elif (currentDayGlb == 6):
    currentDayGlb = 0

else:
    currentDayGlb = currentDayGlb +1

tempDayToPrint = whatDayIsIt (currentDayGlb)
readWeatherRows (2, tabular, season)
#new_day(tempDayToPrint)

for i in range (1,25,1):
    calcSunPosition(i)    
    calculateApparentTemp (i)

for i in range (1,25,1):
    print_row(i, tempDayToPrint)

if (currentDayGlb == 99):

    if (datetime.now().weekday() == 6):
        currentDayGlb = 0
    
    else:
        currentDayGlb = datetime.now().weekday()+1

elif (currentDayGlb == 6):
    currentDayGlb = 0

else:
    currentDayGlb = currentDayGlb +1

tempDayToPrint = whatDayIsIt (currentDayGlb)
readWeatherRows (1,tabular_2, season)
#new_day(tempDayToPrint)

for i in range (1,25,1):
    calcSunPosition(i)    
    calculateApparentTemp (i)

for i in range (1,25,1):
    print_row(i, tempDayToPrint)

if (currentDayGlb == 99):

    if (datetime.now().weekday() == 6):
        currentDayGlb = 0
    
    else:
        currentDayGlb = datetime.now().weekday()+1

elif (currentDayGlb == 6):
    currentDayGlb = 0

else:
    currentDayGlb = currentDayGlb +1

tempDayToPrint = whatDayIsIt (currentDayGlb)
readWeatherRows (2, tabular_2, season)
#new_day(tempDayToPrint)

for i in range (1,25,1):
    calcSunPosition(i)    
    calculateApparentTemp (i)

for i in range (1,25,1):
    print_row(i, tempDayToPrint)

if (currentDayGlb == 99):

    if (datetime.now().weekday() == 6):
        currentDayGlb = 0
    
    else:
        currentDayGlb = datetime.now().weekday()+1

elif (currentDayGlb == 6):
    currentDayGlb = 0

else:
    currentDayGlb = currentDayGlb +1


tempDayToPrint = whatDayIsIt (currentDayGlb)
readWeatherRows (1,tabular_3,season)
#new_day(tempDayToPrint)

for i in range (1,25,1):
    calcSunPosition(i)    
    calculateApparentTemp (i)

for i in range (1,25,1):
    print_row(i, tempDayToPrint)

if (currentDayGlb == 99):

    if (datetime.now().weekday() == 6):
        currentDayGlb = 0
    else:
        currentDayGlb = datetime.now().weekday()+1

elif (currentDayGlb == 6):
    currentDayGlb = 0

else:
    currentDayGlb = currentDayGlb +1

tempDayToPrint = whatDayIsIt (currentDayGlb)
readWeatherRows (2, tabular_3, season)
#new_day(tempDayToPrint)

for i in range (1,25,1):
    calcSunPosition(i)    
    calculateApparentTemp (i)

for i in range (1,25,1):
    print_row(i, tempDayToPrint)

