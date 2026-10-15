<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    
    <xsl:template match="/">
        <details class="ck-collapse">
            <summary>
                <xsl:value-of select="/*/@title"/>
            </summary>
            <div class="ck-collapse__body">
                <ck-children/>
            </div>
        </details>
    </xsl:template>
    
</xsl:stylesheet>