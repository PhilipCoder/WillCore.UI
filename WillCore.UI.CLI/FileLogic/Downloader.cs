using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Net;
using System.Text;

namespace WillCore.UI.CLI.FileLogic
{
    public static class Downloader
    {
        public static bool DownloadFile(string source, string targetPath)
        {
            try
            {
                Console.WriteLine("Downloading source files....");
                using (var client = new WebClient())
                {
                    client.DownloadFile(source, targetPath);
                }
                Console.WriteLine("Download completed.");
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine("An occurred uncured while downloading source file. Exception details:");
                Console.Write(e.Message);
                return false;
            }
        }

        public static bool ExtractZipArchive(string sourcePath, string targetPath)
        {
            try
            {
                Console.WriteLine("Extracting code package...");
                ZipFile.ExtractToDirectory(sourcePath, targetPath);
                Console.WriteLine("Code package extracted.");
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine("An error occurred while extracting the source package file. Exception details:");
                Console.Write(e.Message);
                return false;
            }
        }
    }
}
