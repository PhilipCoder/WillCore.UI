using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using WillCore.UI.CLI.FileLogic;
using WillCore.UI.CLI.Properties;

namespace WillCore.UI.CLI
{
    public static class HTMLComments
    {
        private const string htmlStartTag = "//<html>";
        private const string htmlEndTag = "//</html>";

        public static void ProcessHTML(string fileName)
        {
            HtmlDocument htmlDoc = loadDocumentDom(fileName);
            string comment = getIdsFromDocument(htmlDoc);
            string metaPath = PathHelper.GetMetaFilePath(fileName);
            string metaContent = PathHelper.GetMetaString(metaPath);
            string templateJS = getMetaTemplateWithJSDocComments(comment, metaContent);
            File.WriteAllText(metaPath, templateJS);
        }

        private static string getMetaTemplateWithJSDocComments(string comment, string templateString)
        {
            var htmlStartIndex = templateString.IndexOf(htmlStartTag) + htmlStartTag.Length;
            var htmlEndIndex = templateString.IndexOf(htmlEndTag);
            return templateString.Substring(0, htmlStartIndex) + comment + templateString.Substring(htmlEndIndex);
        }

        private static HtmlDocument loadDocumentDom(string fileName)
        {
            var htmlDoc = new HtmlDocument();
            var fileContents = File.ReadAllText(fileName);
            if (htmlDoc.DocumentNode.Name.ToLower() != "body")
            {
                htmlDoc.LoadHtml($"<html><body>{fileContents}</body></html>");
            }
            else
            {
                htmlDoc.LoadHtml(fileContents);
            }

            return htmlDoc;
        }

        private static string getIdsFromDocument(HtmlDocument htmlDoc)
        {
            var ids = htmlDoc.DocumentNode.SelectNodes("//*").Nodes().Where(x => !String.IsNullOrEmpty(x.Id)).ToList();
            var commentBuilder = new StringBuilder();
            ids.Select(x => $"/**\r\n*{x.Name}\r\n*@type {{element}}\r\n*/\r\nthis.${x.Id}=null;").ToList().ForEach(x => commentBuilder.AppendLine(x));
            var comment = commentBuilder.ToString();
            return $"\r\n{comment}";
        }
    }
}
